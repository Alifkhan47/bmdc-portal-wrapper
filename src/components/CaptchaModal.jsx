import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ArrowRight, X } from 'lucide-react';

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
  onClose,
  theme = 'dark'
}) {
  const [solution, setSolution] = useState('');
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const inputRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      setSolution('');
      setRefreshKey(Date.now());
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className={`w-full max-w-md border rounded-3xl p-6 sm:p-8 relative transition-colors ${
        isDark ? 'border-zinc-800 bg-[#0f1411] text-[#f2fdf4]' : 'border-slate-200 bg-white text-slate-900'
      }`}>
        {/* Header bar */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-inherit">
          <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Security Verification
          </span>
          <button
            type="button"
            onClick={onClose}
            disabled={isVerifying}
            aria-label="Close"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
              isDark
                ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Target Info */}
        <div className={`border rounded-2xl p-3.5 mb-6 font-mono text-xs flex items-center justify-between ${
          isDark
            ? 'border-[#d4f870]/20 bg-[#121c15]'
            : 'border-slate-200 bg-slate-100'
        }`}>
          <span className={`uppercase font-bold tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Query Target:
          </span>
          <span className={`font-mono font-extrabold uppercase tracking-wider text-sm ${
            isDark ? 'text-[#d4f870]' : 'text-[#0a2e16]'
          }`}>
            {doctorType} #{cleanRegNo}
          </span>
        </div>

        {/* Error notification if retry */}
        {errorMessage && (
          <div className="mb-6 border border-red-500/40 rounded-2xl bg-red-500/10 p-3 font-mono text-xs text-red-600 dark:text-red-400">
            <p className="font-bold">STATUS: {errorMessage.toUpperCase()}</p>
            <p className="text-[10px] mt-1 opacity-80">
              NEW SECURITY CHALLENGE GENERATED. ENTER CODE BELOW.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Captcha Image Display & Reload */}
          <div className="space-y-2">
            <label className={`block font-mono text-xs uppercase tracking-wider font-bold ${
              isDark ? 'text-zinc-300' : 'text-slate-700'
            }`}>
              Council Captcha Challenge Image
            </label>
            <div className={`border rounded-2xl p-3 flex items-center justify-between bg-white ${
              isDark ? 'border-zinc-700' : 'border-slate-200'
            }`}>
              <div className="min-h-[48px] min-w-[140px] flex items-center justify-center overflow-hidden">
                {captchaImage || sessionId ? (
                  <img
                    key={refreshKey}
                    src={captchaImage || `/api/session/${sessionId}/captcha.jpg?t=${refreshKey}`}
                    alt="BMDC Verification Captcha"
                    className="h-10 w-auto object-contain select-none pointer-events-none"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                ) : (
                  <div className="font-mono text-xs text-zinc-500">Awaiting stream...</div>
                )}
              </div>

              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing || isVerifying}
                className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 ${
                  isDark
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                    : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>RELOAD</span>
              </button>
            </div>
          </div>

          {/* Solution Input */}
          <div className="space-y-2">
            <label className={`block font-mono text-xs uppercase tracking-wider font-bold ${
              isDark ? 'text-zinc-300' : 'text-slate-700'
            }`}>
              Enter Captcha Code (6 Characters)
            </label>
            <input
              ref={inputRef}
              type="text"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="e.g. HMdgnW"
              maxLength={8}
              disabled={isVerifying}
              className={`w-full border-b-2 py-3 text-3xl font-mono font-extrabold tracking-widest text-center bg-transparent transition-colors focus:outline-none ${
                isDark
                  ? 'border-zinc-700 text-[#f2fdf4] placeholder:text-zinc-700 focus:border-[#d4f870]'
                  : 'border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#0a2e16]'
              }`}
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className={`rounded-full py-3.5 font-bold text-xs uppercase tracking-wider border transition-colors cursor-pointer disabled:opacity-50 ${
                isDark
                  ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={solution.trim().length < 3 || isVerifying}
              className={`rounded-full py-3.5 font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                isDark
                  ? 'bg-[#d4f870] text-[#07170c] hover:bg-[#dbf98d]'
                  : 'bg-[#0a2e16] text-[#d4f870] hover:bg-[#06200f]'
              }`}
            >
              <span>{isVerifying ? 'Verifying...' : 'Confirm'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
