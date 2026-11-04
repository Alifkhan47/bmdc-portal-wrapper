import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ArrowRight, Check } from 'lucide-react';

export default function CaptchaModal({
  isOpen,
  sessionId,
  captchaImage,
  cleanRegNo,
  doctorType = 'MBBS',
  isRefreshing,
  isVerifying,
  errorMessage,
  onRefresh,
  onSubmit,
  onClose
}) {
  const [solution, setSolution] = useState('');
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSolution('');
      setRefreshKey(Date.now());
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 120);
    }
  }, [isOpen, captchaImage, sessionId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isVerifying) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isVerifying, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (solution.trim().length >= 3 && !isVerifying) {
      onSubmit(solution.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl flex flex-col gap-4">
        {/* Top Indicator Strip */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-tertiary-fixed-dim inline-block"></span>
            <span className="font-label-code text-[#fcf9f2] uppercase tracking-widest text-xs">
              Protocol Gate
            </span>
          </div>
          <div className="font-label-code text-xs text-[#1b1c18] uppercase tracking-widest bg-surface-container px-2.5 py-0.5 rounded-xs font-semibold">
            Target: {doctorType} #{cleanRegNo}
          </div>
        </div>

        {/* Modal Card */}
        <div className="bg-surface-container-lowest p-6 sm:p-10 shadow-xl border border-on-surface/10 flex flex-col gap-6">
          <header className="flex flex-col gap-1.5">
            <p className="font-label-caps text-secondary uppercase tracking-widest">
              Autonomous Access Check
            </p>
            <h2 className="font-headline-md font-serif text-on-surface tracking-tight">
              Security Verification
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Resolve the algorithmic glyph string to unlock records for dossier{' '}
              <span className="font-label-code text-on-surface font-bold">
                #{doctorType === 'BDS' ? 'D' : 'A'}-{cleanRegNo}
              </span>.
            </p>
          </header>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-error-container text-on-error-container font-label-code text-xs uppercase tracking-wider flex items-center justify-between">
              <span>{errorMessage}</span>
              <span className="font-bold">RETRY</span>
            </div>
          )}

          {/* Visual Challenge Container */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-code text-secondary uppercase tracking-wider">
                Visual Challenge
              </span>
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing || isVerifying}
                className="flex items-center gap-1.5 font-label-code text-on-surface hover:text-secondary transition-colors uppercase tracking-widest cursor-pointer disabled:opacity-50"
                title="Reload CAPTCHA challenge"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>

            {/* Enlarged Captcha Canvas */}
            <div
              onClick={onRefresh}
              className="relative bg-surface-container-high min-h-[130px] sm:min-h-[150px] flex items-center justify-center overflow-hidden select-none border border-on-surface/10 cursor-pointer group"
              title="Click to regenerate challenge"
            >
              {/* Subtle Architectural Grid Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="modal-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-on-surface" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#modal-grid)" />
                <line x1="0" y1="25" x2="100%" y2="75" stroke="currentColor" strokeWidth="0.75" className="text-on-surface" />
                <line x1="0" y1="75" x2="100%" y2="25" stroke="currentColor" strokeWidth="0.75" className="text-on-surface" />
              </svg>

              {/* CAPTCHA Stream Display: Enlarged & High Contrast */}
              <div className="relative z-10 flex items-center justify-center p-3">
                {captchaImage || sessionId ? (
                  <div className="bg-white p-2.5 rounded shadow-sm border border-black/10 transition-transform duration-200 group-hover:scale-105">
                    <img
                      key={refreshKey}
                      src={captchaImage || `/api/session/${sessionId}/captcha.jpg?t=${refreshKey}`}
                      alt="BMDC Security Captcha Challenge"
                      className="h-14 sm:h-16 w-auto object-contain select-none pointer-events-none"
                      style={{
                        imageRendering: 'crisp-edges',
                        minWidth: '180px'
                      }}
                    />
                  </div>
                ) : (
                  <div className="font-label-code text-xs text-secondary animate-pulse uppercase tracking-wider">
                    Establishing Secure Challenge Stream...
                  </div>
                )}
              </div>

              <div className="absolute bottom-2 right-3 font-label-code text-[10px] text-on-surface-variant opacity-60 pointer-events-none uppercase">
                ISO/IEC 27001
              </div>

              <div className="absolute bottom-2 left-3 font-label-code text-[9px] text-secondary opacity-70 pointer-events-none uppercase">
                Click image to refresh
              </div>
            </div>
          </div>

          {/* Form: Allows exact case (Upper and Lower case) */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <label
                  htmlFor="captchaInput"
                  className="font-label-code uppercase tracking-wider text-secondary"
                >
                  Enter code
                </label>
                <span className="font-label-code text-secondary tracking-wider text-[11px]">
                  Case-sensitive • Enter exact characters
                </span>
              </div>

              <div className="relative">
                <input
                  id="captchaInput"
                  ref={inputRef}
                  type="text"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="e.g. 69zMia"
                  maxLength={8}
                  disabled={isVerifying}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full bg-surface-container-low px-4 py-3.5 font-label-code text-2xl text-on-surface placeholder:text-outline-variant/60 tracking-[0.25em] focus:outline-none focus:bg-surface-container transition-colors"
                />
                {solution.length >= 4 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-tertiary-container">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <button
                type="submit"
                disabled={solution.trim().length < 3 || isVerifying}
                className="bg-primary text-on-primary font-label-caps uppercase px-8 py-4 tracking-widest hover:bg-on-surface-variant active:bg-primary transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isVerifying ? 'Verifying...' : 'Confirm & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isVerifying}
                className="font-label-code text-xs uppercase tracking-widest text-secondary hover:text-on-surface text-center py-2 underline underline-offset-4 decoration-1 cursor-pointer"
              >
                Cancel Verification
              </button>
            </div>
          </form>
        </div>

        {/* Modal Bottom Metadata */}
        <div className="flex items-center justify-between text-[#fcf9f2] opacity-80 px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-outline-variant inline-block"></span>
            <span className="font-label-code text-xs uppercase tracking-widest">
              TLS 1.3 Certified
            </span>
          </div>
          <div className="font-label-code text-xs uppercase tracking-widest">
            Node: FRA-01 • 14ms
          </div>
        </div>
      </div>
    </div>
  );
}
