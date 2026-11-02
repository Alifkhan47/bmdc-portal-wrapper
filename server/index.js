const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const {
  initSession,
  refreshCaptcha,
  submitVerification,
  closeSession,
  getSession,
  sanitizeRegNo
} = require('./bmdcEngine');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    portal: 'BMDC Verification Proxy Engine',
    timestamp: new Date().toISOString()
  });
});

// Serve CAPTCHA image directly as binary HTTP response
app.get('/api/session/:sessionId/captcha.jpg', (req, res) => {
  const session = getSession(req.params.sessionId);
  if (!session || !session.captchaBuffer) {
    return res.status(404).send('Session or CAPTCHA not found.');
  }
  res.set('Content-Type', session.captchaMime || 'image/jpeg');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.send(session.captchaBuffer);
});

// 1. Initialize CAPTCHA Relay Session
app.post('/api/session/init', async (req, res) => {
  try {
    const { regNo, doctorType } = req.body;
    if (!regNo) {
      return res.status(400).json({ error: 'Registration number is required.' });
    }

    const cleanRegNo = sanitizeRegNo(regNo);
    if (!cleanRegNo) {
      return res.status(400).json({ error: 'Invalid registration number. Please provide numeric digits.' });
    }

    const sessionData = await initSession(cleanRegNo, doctorType || 'MBBS');
    res.json({
      success: true,
      ...sessionData
    });
  } catch (err) {
    console.error('API /session/init error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to initialize verification session with BMDC.'
    });
  }
});

// 2. Refresh CAPTCHA
app.post('/api/session/refresh', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    const data = await refreshCaptcha(sessionId);
    res.json({
      success: true,
      ...data
    });
  } catch (err) {
    console.error('API /session/refresh error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to refresh CAPTCHA image.'
    });
  }
});

// 3. Submit CAPTCHA Solution & Verify
app.post('/api/session/verify', async (req, res) => {
  try {
    const { sessionId, captchaSolution } = req.body;
    if (!sessionId || !captchaSolution) {
      return res.status(400).json({ error: 'Session ID and CAPTCHA solution are required.' });
    }

    const result = await submitVerification(sessionId, captchaSolution);
    res.json(result);
  } catch (err) {
    console.error('API /session/verify error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to submit verification to BMDC.'
    });
  }
});

// 4. Close Session
app.delete('/api/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await closeSession(sessionId);
    res.json({ success: true, message: 'Session closed.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend static build in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  console.log(`[Server] Serving production frontend build from ${distPath}`);
  app.use(express.static(distPath));
  // Express 5 compatible SPA fallback
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`BMDC Verification Gateway active on http://localhost:${PORT}`);
  console.log(`Direct access: http://127.0.0.1:${PORT}`);
  console.log(`API Endpoints ready: /api/session/init, /api/session/verify`);
  console.log(`======================================================\n`);
});
