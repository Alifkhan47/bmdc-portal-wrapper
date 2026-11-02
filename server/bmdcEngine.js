const { connect } = require('puppeteer-real-browser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { parseBmdcResponse } = require('./parser');

// Active sessions map: sessionId -> { browser, page, cleanRegNo, doctorType, captchaBuffer, captchaMime, captchaImage, createdAt }
const sessions = new Map();

// Session timeout: 5 minutes
const SESSION_TTL_MS = 5 * 60 * 1000;

// Periodic cleanup of stale sessions
setInterval(async () => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      console.log(`[Session GC] Expiring stale session ${id}`);
      try {
        if (session.browser) await session.browser.close();
      } catch (e) {}
      sessions.delete(id);
    }
  }
}, 30000);

/**
 * Strips all non-digit characters and prefixes like "A-"
 */
function sanitizeRegNo(input) {
  if (!input) return '';
  return String(input).replace(/[^0-9]/g, '');
}

/**
 * Detects local Chrome or Edge executable
 */
function getBrowserExecutablePath() {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

/**
 * Intercepts / captures the CAPTCHA image element as both raw Buffer and Data URL
 */
async function captureCaptcha(page) {
  await page.waitForSelector('#captcha1 img', { timeout: 15000 });

  // Strategy 1: Fetch direct image bytes via in-page FileReader
  try {
    const directDataUrl = await page.evaluate(async () => {
      const img = document.querySelector('#captcha1 img');
      if (!img || !img.src) return null;
      try {
        const res = await fetch(img.src, { credentials: 'include' });
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        return null;
      }
    });

    if (directDataUrl && typeof directDataUrl === 'string' && directDataUrl.startsWith('data:image/')) {
      const mimeMatch = directDataUrl.match(/^data:([^;]+);base64,/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const base64Data = directDataUrl.substring(directDataUrl.indexOf(',') + 1);
      const buffer = Buffer.from(base64Data, 'base64');
      return { dataUrl: directDataUrl, buffer, mime };
    }
  } catch (err) {
    console.warn('[BMDC Engine] In-page CAPTCHA fetch failed, trying element screenshot fallback:', err.message);
  }

  // Strategy 2: Element screenshot converted safely via Buffer.from()
  const captchaEl = await page.$('#captcha1 img');
  if (!captchaEl) throw new Error('Captcha element #captcha1 img not found on BMDC page');

  await new Promise((r) => setTimeout(r, 400));
  const rawBytes = await captchaEl.screenshot({ type: 'png' });
  const buffer = Buffer.from(rawBytes);
  const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
  return { dataUrl, buffer, mime: 'image/png' };
}

/**
 * Initializes a new headless BMDC verification session
 */
async function initSession(rawRegNo, doctorType = 'MBBS') {
  const cleanRegNo = sanitizeRegNo(rawRegNo);
  if (!cleanRegNo) {
    throw new Error('Please enter a valid doctor registration number.');
  }

  const execPath = getBrowserExecutablePath();
  console.log(`[BMDC Engine] Spinning up session for Reg No: ${cleanRegNo} (${doctorType}), Browser: ${execPath}`);

  // Launch browser with puppeteer-real-browser to bypass Cloudflare Turnstile
  const response = await connect({
    headless: false,
    args: [
      '--window-position=-2400,-2400',
      '--window-size=1280,900',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
    customConfig: {},
    turnstile: true,
    connectOption: {},
    disableXvfb: true,
    executablePath: execPath
  });

  const { page, browser } = response;
  const sessionId = crypto.randomUUID();

  try {
    // Navigate to BMDC verification portal
    console.log(`[BMDC Engine] [${sessionId}] Navigating to https://verify.bmdc.org.bd/...`);
    await page.goto('https://verify.bmdc.org.bd/', { waitUntil: 'domcontentloaded', timeout: 35000 });

    // Wait for Turnstile to clear and page title to settle
    let bypassed = false;
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const title = await page.title();
      if (!title.includes('Just a moment')) {
        bypassed = true;
        break;
      }
    }

    if (!bypassed) {
      throw new Error('Verification portal took too long to clear security checkpoint. Please retry.');
    }

    // Ensure form is visible
    await page.waitForSelector('#regform', { timeout: 10000 });

    // Select doctor type (MBBS = value 1, BDS = value 2)
    const radioVal = doctorType.toUpperCase() === 'BDS' ? '2' : '1';
    if (radioVal === '2') {
      await page.click('#reg_student2').catch(() => {});
    } else {
      await page.click('#reg_student1').catch(() => {});
    }

    // Capture CAPTCHA image
    const captcha = await captureCaptcha(page);

    // Save session in memory
    sessions.set(sessionId, {
      browser,
      page,
      cleanRegNo,
      doctorType: doctorType.toUpperCase() === 'BDS' ? 'BDS' : 'MBBS',
      captchaBuffer: captcha.buffer,
      captchaMime: captcha.mime,
      captchaImage: captcha.dataUrl,
      createdAt: Date.now()
    });

    console.log(`[BMDC Engine] [${sessionId}] Session ready. CAPTCHA captured successfully (${captcha.buffer.length} bytes, ${captcha.mime}).`);

    return {
      sessionId,
      cleanRegNo,
      doctorType: doctorType.toUpperCase() === 'BDS' ? 'BDS' : 'MBBS',
      captchaImage: captcha.dataUrl,
      captchaUrl: `/api/session/${sessionId}/captcha.jpg`
    };
  } catch (err) {
    console.error(`[BMDC Engine] [${sessionId}] Init error:`, err);
    try {
      await browser.close();
    } catch (e) {}
    throw err;
  }
}

/**
 * Refreshes the CAPTCHA image in an existing session
 */
async function refreshCaptcha(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Session expired or not found. Please start a new search.');
  }

  const { page } = session;
  console.log(`[BMDC Engine] [${sessionId}] Reloading CAPTCHA...`);

  // Call BMDC's native reload_captcha() function
  await page.evaluate(() => {
    if (typeof reload_captcha === 'function') {
      reload_captcha();
    } else {
      const reloadBtn = document.querySelector('#reload');
      if (reloadBtn) reloadBtn.click();
    }
  });

  // Wait for image reload
  await new Promise((r) => setTimeout(r, 1200));

  const captcha = await captureCaptcha(page);
  session.captchaBuffer = captcha.buffer;
  session.captchaMime = captcha.mime;
  session.captchaImage = captcha.dataUrl;

  return {
    captchaImage: captcha.dataUrl,
    captchaUrl: `/api/session/${sessionId}/captcha.jpg`
  };
}

/**
 * Injects solution, submits form to BMDC, scrapes and parses response
 */
async function submitVerification(sessionId, captchaSolution) {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Session has expired. Please re-enter the registration number.');
  }

  const { page, cleanRegNo, doctorType } = session;
  const cleanCaptcha = String(captchaSolution || '').trim();

  if (!cleanCaptcha) {
    throw new Error('Please enter the 4-character CAPTCHA code.');
  }

  console.log(`[BMDC Engine] [${sessionId}] Submitting verification for ${cleanRegNo} with solution: ${cleanCaptcha}`);

  try {
    // Fill Registration Number
    await page.evaluate((val) => {
      const input = document.querySelector('#reg_ful_no');
      if (input) {
        input.value = val;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, cleanRegNo);

    // Set radio value
    const radioId = doctorType === 'BDS' ? '#reg_student2' : '#reg_student1';
    await page.click(radioId).catch(() => {});

    // Fill CAPTCHA code
    await page.evaluate((val) => {
      const input = document.querySelector('#captcha_code');
      if (input) {
        input.value = val;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, cleanCaptcha);

    // Submit form and wait for response
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {}),
      page.click('#submit')
    ]);

    // Wait for the result or error alert to appear in DOM
    try {
      await page.waitForFunction(
        () => {
          const body = document.body ? document.body.innerText : '';
          return (
            body.includes('BM&DC') ||
            body.includes('Registered') ||
            body.includes('Date of Birth') ||
            body.includes('Father') ||
            body.includes('Invalid') ||
            body.includes('not found') ||
            document.querySelector('.profile') !== null ||
            document.querySelector('table') !== null
          );
        },
        { timeout: 15000 }
      );
    } catch (e) {
      console.warn('[BMDC Engine] Wait for result elements timed out, proceeding to scrape...');
    }

    await new Promise((r) => setTimeout(r, 1000));

    // 1. Capture exact doctor portrait photos via element screenshot
    // Specifically target .col-md-4 .profile img elements (strictly excluding any header/logo/QR)
    const photos = [];
    try {
      const profileImgEls = await page.$$('.col-md-4 .profile img, .col-md-4 img.img-responsive');
      for (const el of profileImgEls) {
        try {
          const rawBytes = await el.screenshot({ type: 'jpeg', quality: 95 });
          if (rawBytes && rawBytes.length > 500) {
            const b64 = `data:image/jpeg;base64,${Buffer.from(rawBytes).toString('base64')}`;
            // Avoid duplicate captures
            if (!photos.includes(b64)) {
              photos.push(b64);
            }
          }
        } catch (e) {}
      }
    } catch (photoErr) {
      console.warn('[BMDC Engine] Profile photo element screenshot failed:', photoErr.message);
    }

    // 2. Capture QR code element screenshot
    let qrCode = null;
    try {
      const qrEl = await page.$('.col-md-8 img, img[src*="qrserver.com"], img[src*="create-qr-code"]');
      if (qrEl) {
        const rawBytes = await qrEl.screenshot({ type: 'png' });
        if (rawBytes && rawBytes.length > 100) {
          qrCode = `data:image/png;base64,${Buffer.from(rawBytes).toString('base64')}`;
        }
      }
    } catch (qrErr) {
      console.warn('[BMDC Engine] QR element screenshot error:', qrErr.message);
    }

    // 3. Take screenshot of the full verification result card as proof
    let resultScreenshot = null;
    try {
      const containerEl = (await page.$('#capture')) || (await page.$('.form-body')) || (await page.$('.container')) || (await page.$('body'));
      if (containerEl) {
        const rawShot = await containerEl.screenshot({ type: 'png' });
        const shotBuffer = Buffer.from(rawShot);
        resultScreenshot = `data:image/png;base64,${shotBuffer.toString('base64')}`;
      }
    } catch (shotErr) {
      console.warn('[BMDC Engine] Result screenshot capture error:', shotErr.message);
    }

    const html = await page.content();
    try {
      fs.writeFileSync(path.join(__dirname, 'last-result.html'), html, 'utf8');
    } catch (e) {}

    const result = parseBmdcResponse(html);

    if (result.doctor) {
      if (!result.doctor.regNo) result.doctor.regNo = `A-${cleanRegNo}`;
      if (!result.doctor.doctorType) result.doctor.doctorType = doctorType === 'BDS' ? 'BDS Dental Surgeon' : 'MBBS Doctor';

      if (photos.length > 0) {
        result.doctor.photos = photos;
        result.doctor.photo = photos[0];
      }
      if (qrCode) {
        result.doctor.qrCode = qrCode;
      }
      if (resultScreenshot) {
        result.doctor.resultScreenshot = resultScreenshot;
      }
    }

    // If CAPTCHA was wrong, capture the new CAPTCHA for retry
    if (!result.success && result.isCaptchaError) {
      console.log(`[BMDC Engine] [${sessionId}] CAPTCHA error detected from BMDC. Capturing new CAPTCHA...`);
      try {
        const captcha = await captureCaptcha(page);
        session.captchaBuffer = captcha.buffer;
        session.captchaMime = captcha.mime;
        session.captchaImage = captcha.dataUrl;

        return {
          success: false,
          error: result.error || 'Invalid Captcha Code! Please try again with the new code.',
          isCaptchaError: true,
          newCaptcha: captcha.dataUrl,
          captchaUrl: `/api/session/${sessionId}/captcha.jpg`
        };
      } catch (e) {}
    }

    // Clean up session if verification completed (success or non-retryable error)
    await closeSession(sessionId);

    return result;
  } catch (err) {
    console.error(`[BMDC Engine] [${sessionId}] Submission error:`, err);
    await closeSession(sessionId);
    throw err;
  }
}

/**
 * Safely closes and cleans up a session
 */
async function closeSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) {
    try {
      if (session.browser) await session.browser.close();
    } catch (e) {}
    sessions.delete(sessionId);
    console.log(`[BMDC Engine] [${sessionId}] Session closed and cleaned.`);
  }
}

function getSession(sessionId) {
  return sessions.get(sessionId);
}

module.exports = {
  initSession,
  refreshCaptcha,
  submitVerification,
  closeSession,
  getSession,
  sanitizeRegNo
};
