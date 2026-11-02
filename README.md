# Bangladesh Medical & Dental Council (BMDC) Portal Wrapper

A modern, high-performance web wrapper, practitioner verification gateway, and interactive CAPTCHA relay for the official **Bangladesh Medical & Dental Council (BMDC)** registry (`https://verify.bmdc.org.bd/`).

---

## ⚡ Architecture Highlights

1. **Interactive CAPTCHA Relay**:
   - The BMDC portal is protected by Cloudflare Turnstile as well as dynamic image CAPTCHAs.
   - An automated stealth headless browser (`puppeteer-real-browser`) handles session negotiation, clears challenges, and intercepts the 6-character CAPTCHA image.
   - The CAPTCHA stream is relayed directly to the frontend modal without session dropouts.
   - The user inputs the CAPTCHA once; the backend submits the solution, scrapes the council registry, and parses the profile into clean, structured data.

2. **Automated Input Normalization**:
   - Seamlessly accepts both prefixed (e.g. `A-33919`, `B-1234`) and raw numeric inputs, sanitizing them automatically to prevent legacy BMDC portal query faults.
   - One-click category toggle for **MBBS Doctor** and **BDS Dental Surgeon**.

3. **Clean, Focused Modern UI**:
   - **Zero Clutter**: Clean layout putting registration lookup right at the center without distracting banners.
   - **Accessible Data Hierarchy**: High-contrast typography, structured practitioner dossier, and responsive design.
   - **Official Artifacts**: Extracts and displays archived student portraits, current registry profile portraits, recognized medical specialities table, and official QR authentication seal.
   - **Theme Support**: Default light mode with quick toggle for dark mode.

---

## 🚀 Quick Start (Single Command)

To launch the full-stack portal locally:

```bash
npm start
```
*(Or in PowerShell if script execution is restricted: `node server/index.js` or double-click `start.bat`)*

The application will be live at:
👉 **`http://localhost:5000`**

For development with hot module replacement (HMR):
```bash
npm run dev
```

---

## 🛠️ Stack
- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Vite.
- **Backend**: Node.js, Express 5, Puppeteer-Real-Browser (stealth CDP engine), Cheerio.
- **Compatibility**: Windows / Linux / macOS.
