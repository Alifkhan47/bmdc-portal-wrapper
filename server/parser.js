const cheerio = require('cheerio');

/**
 * Strict parser for BMDC verification portal responses.
 * Uses exact regex matching on isolated tokens to prevent data bleeding.
 */
function parseBmdcResponse(html, rawInnerText = '') {
  if (!html && !rawInnerText) {
    return { success: false, error: 'Empty response received from verification portal.' };
  }

  const $ = cheerio.load(html || '');

  // 1. Check for portal alerts or invalid messages
  const alertEl = $('.alert, .alert-danger, .alert-warning, #message, .form-subtitle, .text-danger');
  let alertText = '';
  if (alertEl.length > 0) {
    alertText = alertEl.text().replace(/×/g, '').trim().replace(/\s+/g, ' ');
  }

  if (
    alertText &&
    (alertText.toLowerCase().includes('invalid') ||
      alertText.toLowerCase().includes('not found') ||
      alertText.toLowerCase().includes('failed') ||
      alertText.toLowerCase().includes('captcha'))
  ) {
    return {
      success: false,
      error: alertText,
      isCaptchaError: alertText.toLowerCase().includes('captcha')
    };
  }

  const doctor = {
    regNo: '',
    doctorType: 'MBBS Doctor',
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    bloodGroup: '',
    regYear: '',
    regValidity: '',
    portableCardNo: '',
    regStatus: 'ACTIVE',
    qualifications: [],
    photos: [],
    qrCode: '',
    generatedOn: '',
    rawFields: {}
  };

  // 2. Doctor Category (MBBS / BDS)
  const headerText = $('h3').first().text().trim() || $('h3:contains("Registered")').text().trim();
  if (/BDS/i.test(headerText)) {
    doctor.doctorType = 'BDS Dental Surgeon';
  } else if (/MBBS/i.test(headerText)) {
    doctor.doctorType = 'MBBS Doctor';
  }

  // 3. Registration Number (e.g. "A-33919")
  const regBadgeText = $('.badge.badge-pill.badge-success, .badge-success').first().text().trim();
  if (regBadgeText && /[A-Z]-\d+/i.test(regBadgeText)) {
    doctor.regNo = regBadgeText.toUpperCase();
  } else {
    const regMatch = (html || '').match(/\b([A-Z]-\d{3,7})\b/i);
    if (regMatch) doctor.regNo = regMatch[1].toUpperCase();
  }

  // 4. Doctor Name (e.g. "PABINA AFROZ PARVEEN")
  $('h3').each((_, el) => {
    if (doctor.name) return;
    const txt = $(el).text().trim();
    if (
      txt &&
      txt.length >= 3 &&
      txt.length <= 60 &&
      !/^(Registered|BM&DC|Full Reg|A-\d|B-\d|D-\d)/i.test(txt) &&
      /[A-Z]{3,}/i.test(txt)
    ) {
      doctor.name = txt.toUpperCase();
    }
  });

  if (!doctor.name) {
    const nameCandidate = $('.badge-success').parent().next('h3').text().trim() ||
      $('.badge-success').next('h3').text().trim();
    if (nameCandidate) doctor.name = nameCandidate.toUpperCase();
  }

  // 5. Registration Year: Strictly extract ONLY 4 digits (e.g. "2002")
  const rawYear = $('small:contains("Reg. Year"), small:contains("Reg Year")')
    .parent()
    .find('h5, span')
    .last()
    .text()
    .trim() ||
    (html.match(/Reg\.?\s*Year[\s\S]*?class="[^"]*text-info[^"]*">\s*([0-9]{4})\s*<\/span>/i) ? RegExp.$1 : '');
  const yearMatch = (rawYear || html).match(/\b(19\d{2}|20\d{2})\b/);
  doctor.regYear = yearMatch ? yearMatch[0] : 'N/A';

  // 6. Reg. Valid Till: Strictly extract date (e.g. "10/2027" or "Permanent")
  const rawValidity = $('small:contains("Reg. Valid Till"), small:contains("Valid Till")')
    .parent()
    .find('h5, span')
    .last()
    .text()
    .trim() ||
    (html.match(/Reg\.?\s*Valid\s*Till[\s\S]*?class="[^"]*text-success[^"]*">\s*([0-9\/\-]+|Permanent)\s*<\/span>/i) ? RegExp.$1 : '');
  const valMatch = (rawValidity || '').match(/\b(\d{1,2}\/\d{4}|Permanent|N\/A)\b/i);
  doctor.regValidity = valMatch ? valMatch[0] : 'Permanent / N/A';

  // 7. Portable Card No: FIX - Strict match to prevent "t Issued" bug
  const cardBlockText = $('small:contains("Portable Card No"), small:contains("Card No")')
    .parent()
    .text()
    .trim();
  const rawCardVal = $('small:contains("Portable Card No"), small:contains("Card No")')
    .parent()
    .find('h5, span')
    .last()
    .text()
    .trim();

  if (/Not\s*Issued/i.test(cardBlockText) || /Not\s*Issued/i.test(rawCardVal) || /Not\s*Issued/i.test(html)) {
    doctor.portableCardNo = 'Not Issued';
  } else if (rawCardVal && !/^(Portable|Card|No)/i.test(rawCardVal)) {
    doctor.portableCardNo = rawCardVal.replace(/[:\s-]+/g, ' ').trim();
  } else {
    const cardMatch = (html || '').match(/Portable\s*Card\s*No[\s\S]*?class="[^"]*text-muted[^"]*">\s*([^\r\n<]+)\s*<\/span>/i);
    if (cardMatch && /Not\s*Issued/i.test(cardMatch[1])) {
      doctor.portableCardNo = 'Not Issued';
    } else if (cardMatch && cardMatch[1].trim()) {
      doctor.portableCardNo = cardMatch[1].trim();
    } else {
      doctor.portableCardNo = 'Not Issued';
    }
  }

  // 8. Date of Birth & 9. Blood Group: FIX - Extract from lower biographical block
  // Use exact regexes:
  // DOB: match(/\*\*[\/\-]\*\*[\/\-]\d{4}|\d{2}[\/\-]\d{2}[\/\-]\d{4}/)
  // Blood Group: match(/(A|B|AB|O)[\+\-]/)
  const bioContainer = $('label:contains("Date of Birth"), label:contains("Blood Group")')
    .closest('.form-group, .row, .bg-light, .form-items, #capture');
  const bioText = (bioContainer.length > 0 ? bioContainer.text() : $('.form-items, .bg-light, body').text())
    .replace(/\+88[0-9\-]+/g, '') // remove telephone numbers to avoid false positive DOB match
    .replace(/\s+/g, ' ');

  const dobMatch = bioText.match(/\*\*[\/\-]\*\*[\/\-]\d{4}|\d{2}[\/\-]\d{2}[\/\-]\d{4}/);
  doctor.dob = dobMatch ? dobMatch[0] : 'Not Disclosed';

  let bgMatch = bioText.match(/Blood\s*Group[\s:]*([A-Za-z0-9\+\-\(\)]+)/i);
  if (bgMatch) {
    const innerBg = bgMatch[1].match(/(A|B|AB|O)[\+\-]/i);
    doctor.bloodGroup = innerBg ? innerBg[0].toUpperCase() : 'Not Recorded';
  } else {
    const directBg = bioText.match(/(A|B|AB|O)[\+\-]/);
    doctor.bloodGroup = directBg ? directBg[0].toUpperCase() : 'Not Recorded';
  }

  // 10. Father's Name: Strictly strip any adjacent labels or navigation text
  const rawFather = $('label:contains("Father\'s Name"), label:contains("Father Name")').next('h6, p, span, div').text().trim() ||
    (html.match(/<label>\s*Father(?:'s)?\s*Name\s*<\/label>\s*<h6[^>]*>\s*([A-Z\s\.\,\'\-]+?)\s*<\/h6>/i) ? RegExp.$1 : '');
  doctor.fatherName = (rawFather || '')
    .replace(/\b(Mother|Date|Blood|Registration|Status|Generated|Back to Home|Take Screenshot).*$/i, '')
    .replace(/^[:\s-]+/, '')
    .trim() || 'Not Disclosed';

  // 11. Mother's Name: Strictly strip any adjacent labels or navigation text
  const rawMother = $('label:contains("Mother\'s Name"), label:contains("Mother Name")').next('h6, p, span, div').text().trim() ||
    (html.match(/<label>\s*Mother(?:'s)?\s*Name\s*<\/label>\s*<h6[^>]*>\s*([A-Z\s\.\,\'\-]+?)\s*<\/h6>/i) ? RegExp.$1 : '');
  doctor.motherName = (rawMother || '')
    .replace(/\b(Father|Date|Blood|Registration|Status|Generated|Back to Home|Take Screenshot).*$/i, '')
    .replace(/^[:\s-]+/, '')
    .trim() || 'Not Disclosed';

  // 12. Registration Status: Strictly "ACTIVE" or status keyword
  const rawStatus = $('label:contains("Registration Status"), label:contains("Status")').next('h6, p, span, div').text().trim() ||
    (html.match(/<label>\s*Registration\s*Status\s*<\/label>[\s\S]*?class="[^"]*text-success[^"]*">\s*([A-Z]+)\s*<\/span>/i) ? RegExp.$1 : 'ACTIVE');
  const statusMatch = (rawStatus || '').match(/\b(ACTIVE|INACTIVE|SUSPENDED|CANCELLED)\b/i);
  doctor.regStatus = statusMatch ? statusMatch[0].toUpperCase() : 'ACTIVE';

  // 13. Recognized Qualifications Table
  $('table tbody tr').each((_, tr) => {
    const tds = $(tr).find('td');
    if (tds.length >= 2) {
      const idx = $(tds[0]).text().trim();
      const deg = $(tds[1]).text().trim().replace(/\s+/g, ' ');
      const obt = tds.length >= 3 ? $(tds[2]).text().trim().replace(/\s+/g, ' ') : '';

      if (deg && !/^(#|no|sl|degree)/i.test(deg)) {
        doctor.qualifications.push({
          index: /^\d+$/.test(idx) ? idx : String(doctor.qualifications.length + 1),
          degree: deg,
          qualification: deg,
          subject: deg,
          obtained: obt,
          passingYear: obt
        });
      }
    }
  });

  // 14. Doctor Profile Photos: Strictly doctor's face portraits in .col-md-4 .profile
  $('.col-md-4 .profile img, .col-md-4 img.img-responsive, .profile img').each((_, img) => {
    const src = $(img).attr('src') || '';
    const alt = ($(img).attr('alt') || '').toLowerCase();
    const parent = $(img).closest('.website-logo, .logo, .col-md-8');
    if (parent.length > 0) return; // exclude site logo and col-md-8 QR code

    if (
      src.startsWith('data:image') &&
      !src.includes('logo') &&
      !alt.includes('logo') &&
      !alt.includes('qr')
    ) {
      doctor.photos.push(src);
    }
  });

  // 15. Official QR Code extraction: Strictly in .col-md-8 or near "BM&DC Full Reg. Number"
  let qrFound = '';
  const col8Img = $('.col-md-8 img, img[src*="qrserver.com"], img[src*="create-qr-code"]').first();
  if (col8Img.length > 0) {
    const src = col8Img.attr('src');
    if (src && !src.includes('logo-light') && !src.includes('favicon')) {
      qrFound = src;
    }
  }

  if (!qrFound) {
    const nearRegImg = $('small:contains("Full Reg. Number"), small:contains("Reg. Number")')
      .parent()
      .find('img')
      .first();
    if (nearRegImg.length > 0) {
      const src = nearRegImg.attr('src');
      if (src && !src.includes('logo-light')) qrFound = src;
    }
  }

  if (qrFound) {
    doctor.qrCode = qrFound;
  }

  // 16. Timestamp cleanup (internal record only, purged from UI)
  const genMatch = (html || '').match(/Generated\s+on\s*:\s*([0-9\/\:\sAPMapm]+)/i);
  if (genMatch) {
    const timeMatch = genMatch[1].match(/(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}(?:\s*[APMapm]{2})?)/);
    doctor.generatedOn = timeMatch ? timeMatch[0].trim() : '';
  }

  if (doctor.name || doctor.regNo || doctor.fatherName || doctor.qualifications.length > 0) {
    return {
      success: true,
      doctor
    };
  }

  return {
    success: false,
    error: alertText || 'Could not parse verification results from portal.'
  };
}

module.exports = {
  parseBmdcResponse
};
