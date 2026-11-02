import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import CaptchaModal from './components/CaptchaModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import DoctorDossier from './components/DoctorDossier';
import ErrorBanner from './components/ErrorBanner';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('bmdc_theme_pref');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });
  const [currentDoctorType, setCurrentDoctorType] = useState('MBBS');
  const [viewState, setViewState] = useState('idle'); // 'idle' | 'initializing' | 'verifying' | 'result' | 'error'
  const [sessionData, setSessionData] = useState(null);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    localStorage.setItem('bmdc_theme_pref', theme);
    localStorage.setItem('bmdc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  // Step 1: Initialize Headless Session & Intercept CAPTCHA
  const handleStartSearch = async (cleanRegNo, doctorType) => {
    setCurrentDoctorType(doctorType);
    setViewState('initializing');
    setGeneralError('');
    setCaptchaError('');

    try {
      const res = await fetch('/api/session/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo: cleanRegNo, doctorType })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize session with BMDC verification portal.');
      }

      setSessionData({
        sessionId: data.sessionId,
        cleanRegNo: data.cleanRegNo,
        doctorType: data.doctorType,
        captchaImage: data.captchaImage
      });

      setViewState('idle');
      setIsCaptchaOpen(true);
    } catch (err) {
      console.error('Init search error:', err);
      setGeneralError(err.message);
      setViewState('error');
    }
  };

  // Step 2: Refresh CAPTCHA image in active session
  const handleRefreshCaptcha = async () => {
    if (!sessionData?.sessionId || isRefreshing) return;
    setIsRefreshing(true);
    setCaptchaError('');

    try {
      const res = await fetch('/api/session/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionData.sessionId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to refresh CAPTCHA.');
      }

      setSessionData((prev) => ({
        ...prev,
        captchaImage: data.captchaImage
      }));
    } catch (err) {
      console.error('Refresh captcha error:', err);
      setCaptchaError('Could not refresh CAPTCHA: ' + err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Step 3: Submit CAPTCHA Solution & Scrape Result
  const handleSubmitCaptcha = async (solution) => {
    if (!sessionData?.sessionId) return;
    setIsCaptchaOpen(false);
    setViewState('verifying');
    setCaptchaError('');

    try {
      const res = await fetch('/api/session/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionData.sessionId,
          captchaSolution: solution
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification submission failed.');
      }

      // Handle wrong CAPTCHA retry
      if (!data.success && data.isCaptchaError) {
        setSessionData((prev) => ({
          ...prev,
          captchaImage: data.newCaptcha || prev.captchaImage
        }));
        setCaptchaError(data.error || 'Invalid CAPTCHA Code. Please try again.');
        setViewState('idle');
        setIsCaptchaOpen(true);
        return;
      }

      // Handle general BMDC error (e.g. "No valid registration found")
      if (!data.success) {
        throw new Error(data.error || 'No matching doctor registration found.');
      }

      // Success
      setDoctorData(data.doctor);
      if (data.doctor?.doctorType) {
        setCurrentDoctorType(data.doctor.doctorType);
      }
      setViewState('result');
    } catch (err) {
      console.error('Verification error:', err);
      setGeneralError(err.message);
      setViewState('error');
    }
  };

  // Cancel / Close Session
  const handleCloseCaptcha = async () => {
    setIsCaptchaOpen(false);
    if (sessionData?.sessionId) {
      fetch(`/api/session/${sessionData.sessionId}`, { method: 'DELETE' }).catch(() => {});
    }
    setSessionData(null);
    setViewState('idle');
  };

  // Reset entire search
  const handleReset = () => {
    if (sessionData?.sessionId) {
      fetch(`/api/session/${sessionData.sessionId}`, { method: 'DELETE' }).catch(() => {});
    }
    setSessionData(null);
    setDoctorData(null);
    setGeneralError('');
    setCaptchaError('');
    setViewState('idle');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
      isDark ? 'bg-[#07170c] text-[#f2fdf4]' : 'bg-[#f6f8f6] text-slate-900'
    }`}>
      {/* Top Header Navbar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        doctorType={doctorData?.doctorType || currentDoctorType}
      />

      {/* Main Container: Centered max-w-5xl */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex-1 space-y-10">
        {/* Hero Section on Idle (Soothing Swiss Layout) */}
        {viewState === 'idle' && !doctorData && (
          <div className="space-y-6">
            {/* Pill Badge */}
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
                isDark
                  ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870]'
                  : 'border-[#0a2e16]/15 bg-[#dcf78a] text-[#0a2e16]'
              }`}>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                  isDark ? 'bg-[#d4f870] text-[#07170c]' : 'bg-[#0a2e16] text-[#d4f870]'
                }`}>
                  Official
                </span>
                <span>Council Verified Healthcare Directory</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Massive Hero Headline */}
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-3xl ${
              isDark ? 'text-[#f2fdf4]' : 'text-slate-900'
            }`}>
              Verify Medical & Dental Practitioner Registry
            </h1>

            {/* Swiss Bullet & Sub-text */}
            <div className="flex items-start space-x-3 pt-1 max-w-2xl">
              <div className="flex space-x-1.5 pt-1.5 shrink-0">
                <span className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-[#d4f870]' : 'bg-[#0a2e16]'}`}></span>
                <span className={`w-2.5 h-2.5 rounded-full opacity-30 ${isDark ? 'bg-[#d4f870]' : 'bg-[#0a2e16]'}`}></span>
              </div>
              <p className={`text-sm sm:text-base font-medium leading-relaxed ${
                isDark ? 'text-zinc-300' : 'text-slate-600'
              }`}>
                Instant, secure credential verification for registered MBBS Doctors and BDS Dental Surgeons under the Bangladesh Medical & Dental Council.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic State Views */}
        {(viewState === 'initializing' || viewState === 'verifying') && (
          <div className="space-y-4">
            <div className={`flex items-center space-x-2 font-mono text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              <span>{viewState === 'initializing' ? 'CONNECTING TO BMDC REGISTRY...' : 'SYNTHESIZING VERIFIED DOSSIER...'}</span>
            </div>
            <LoadingSkeleton theme={theme} />
          </div>
        )}

        {viewState === 'error' && (
          <div className="space-y-8">
            <ErrorBanner message={generalError} onRetry={handleReset} theme={theme} />
            <SearchForm
              onSearch={handleStartSearch}
              isLoading={false}
              theme={theme}
              doctorType={currentDoctorType}
              onDoctorTypeChange={setCurrentDoctorType}
            />
          </div>
        )}

        {viewState === 'result' && doctorData && (
          <DoctorDossier doctor={doctorData} onReset={handleReset} theme={theme} />
        )}

        {viewState === 'idle' && (
          <div className="space-y-8">
            <SearchForm
              onSearch={handleStartSearch}
              isLoading={false}
              theme={theme}
              doctorType={currentDoctorType}
              onDoctorTypeChange={setCurrentDoctorType}
            />
          </div>
        )}
      </main>

      {/* CAPTCHA Modal Relay */}
      <CaptchaModal
        isOpen={isCaptchaOpen}
        sessionId={sessionData?.sessionId}
        captchaImage={sessionData?.captchaImage}
        cleanRegNo={sessionData?.cleanRegNo}
        doctorType={sessionData?.doctorType || currentDoctorType}
        isRefreshing={isRefreshing}
        isVerifying={viewState === 'verifying'}
        errorMessage={captchaError}
        onRefresh={handleRefreshCaptcha}
        onSubmit={handleSubmitCaptcha}
        onClose={handleCloseCaptcha}
        theme={theme}
      />

      {/* Footer */}
      <footer className={`border-t py-6 px-4 sm:px-8 font-mono text-xs transition-colors ${
        isDark ? 'border-[#d4f870]/15 bg-[#07170c] text-zinc-400' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="font-bold uppercase tracking-wider">
            BM&DC // BANGLADESH MEDICAL & DENTAL COUNCIL GATEWAY
          </span>
          <span className="text-[11px] opacity-80">
            SWISS GRID SYSTEM // DESIGNED AFTER MESKA
          </span>
        </div>
      </footer>
    </div>
  );
}
