import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import CaptchaModal from './components/CaptchaModal';
import LoadingSteps from './components/LoadingSteps';
import DoctorDossier from './components/DoctorDossier';
import ErrorBanner from './components/ErrorBanner';

export default function App() {
  const [currentDoctorType, setCurrentDoctorType] = useState('MBBS');
  const [activeRegNo, setActiveRegNo] = useState('');
  const [viewState, setViewState] = useState('idle'); // 'idle' | 'initializing' | 'verifying' | 'result' | 'error'
  const [sessionData, setSessionData] = useState(null);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [doctorData, setDoctorData] = useState(null);

  // Step 1: Initialize Headless Session & Intercept CAPTCHA
  const handleStartSearch = async (cleanRegNo, doctorType) => {
    setActiveRegNo(cleanRegNo);
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
    setActiveRegNo('');
    setDoctorData(null);
    setCurrentDoctorType('MBBS');
    setGeneralError('');
    setCaptchaError('');
    setViewState('idle');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between selection:bg-primary selection:text-surface">
      {/* Top Header Navbar */}
      <Header
        currentView={viewState}
        onHomeClick={handleReset}
      />

      {/* Main Content Area */}
      <main className="w-full pt-28 pb-12 flex-1 flex flex-col justify-start">
        {/* State: Initializing or Verifying */}
        {(viewState === 'initializing' || viewState === 'verifying') && (
          <LoadingSteps
            viewState={viewState}
            regNo={activeRegNo || sessionData?.cleanRegNo}
            doctorType={sessionData?.doctorType || currentDoctorType}
          />
        )}

        {/* State: Error */}
        {viewState === 'error' && (
          <div className="space-y-6 w-full">
            <ErrorBanner message={generalError} onRetry={handleReset} />
            <SearchForm
              onSearch={handleStartSearch}
              isLoading={false}
              doctorType={currentDoctorType}
              onDoctorTypeChange={setCurrentDoctorType}
            />
          </div>
        )}

        {/* State: Result Dossier */}
        {viewState === 'result' && doctorData && (
          <DoctorDossier doctor={doctorData} onReset={handleReset} />
        )}

        {/* State: Idle (Home Search Form) */}
        {viewState === 'idle' && (
          <SearchForm
            onSearch={handleStartSearch}
            isLoading={false}
            doctorType={currentDoctorType}
            onDoctorTypeChange={setCurrentDoctorType}
          />
        )}
      </main>

      {/* CAPTCHA Relay Modal */}
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
      />

      {/* Clean, Minimized Footer */}
      <footer className="w-full bg-surface-container-low mt-16 sm:mt-24 border-t border-on-surface/10 py-6 sm:py-8 print:hidden">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-label-code text-secondary text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-primary">BMDC Wrapper</span>
            <span>•</span>
            <span>Unofficial web wrapper for BMDC registry</span>
            <span>•</span>
            <span>Made by <strong className="text-primary font-bold">Alif Khan</strong></span>
          </div>

          <div>
            <a
              href="https://verify.bmdc.org.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary underline underline-offset-4 tracking-wider font-semibold inline-flex items-center gap-1"
            >
              <span>Original Directory (verify.bmdc.org.bd)</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
