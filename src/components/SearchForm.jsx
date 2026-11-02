import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const normalizeType = (type) => (String(type || '').toUpperCase().includes('BDS') ? 'BDS' : 'MBBS');

export default function SearchForm({ onSearch, isLoading, theme = 'dark', doctorType = 'MBBS', onDoctorTypeChange }) {
  const [rawInput, setRawInput] = useState('');
  const [selectedType, setSelectedType] = useState(() => normalizeType(doctorType));
  const isDark = theme === 'dark';

  // Ensure state stays synced and defaults to MBBS
  useEffect(() => {
    setSelectedType(normalizeType(doctorType));
  }, [doctorType]);

  const handleTypeChange = (type) => {
    const normalized = normalizeType(type);
    setSelectedType(normalized);
    if (onDoctorTypeChange) onDoctorTypeChange(normalized);
  };

  const isBds = normalizeType(selectedType) === 'BDS';
  const isMbbs = !isBds; // Guaranteed auto-selected MBBS default

  // Silently sanitized registration number (digits only)
  const cleanNumber = rawInput.replace(/[^0-9]/g, '');
  const hasPrefix = /[a-zA-Z\-_]/.test(rawInput);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cleanNumber) return;
    onSearch(cleanNumber, isBds ? 'BDS' : 'MBBS');
  };

  const handleQuickSample = (reg, type = 'MBBS') => {
    setRawInput(reg);
    handleTypeChange(type);
  };

  return (
    <div className={`w-full border rounded-3xl p-6 sm:p-10 space-y-8 transition-colors ${
      isDark ? 'border-[#d4f870]/20 bg-[#0d2716] text-[#f2fdf4]' : 'border-slate-200 bg-white text-slate-900'
    }`}>
      {/* Category Toggle Bar (Left-aligned) */}
      <div className="flex items-center justify-start border-b pb-6 border-inherit">
        <div className={`inline-flex rounded-full p-1 border ${
          isDark ? 'bg-[#07170c] border-[#d4f870]/20' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => handleTypeChange('MBBS')}
            className={`rounded-full px-5 py-2 text-xs font-extrabold tracking-wide transition-colors cursor-pointer ${
              isMbbs
                ? isDark
                  ? 'bg-[#d4f870] text-[#07170c]'
                  : 'bg-[#0a2e16] text-[#d4f870]'
                : isDark
                ? 'text-[#d4f870]/70 hover:text-[#d4f870]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MBBS DOCTOR
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('BDS')}
            className={`rounded-full px-5 py-2 text-xs font-extrabold tracking-wide transition-colors cursor-pointer ${
              isBds
                ? isDark
                  ? 'bg-[#d4f870] text-[#07170c]'
                  : 'bg-[#0a2e16] text-[#d4f870]'
                : isDark
                ? 'text-[#d4f870]/70 hover:text-[#d4f870]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            BDS DENTAL
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
            <label className={`uppercase tracking-wider font-bold ${
              isDark ? 'text-zinc-300' : 'text-slate-600'
            }`}>
              Council Registration Number
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Sample:</span>
              <button
                type="button"
                onClick={() => handleQuickSample('A-33919', 'MBBS')}
                className={`rounded-full px-3 py-1 font-bold border underline transition-colors cursor-pointer ${
                  isDark
                    ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870] hover:bg-[#184e29]'
                    : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                A-33919 (MBBS)
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="e.g. A-33919 or 33919"
              disabled={isLoading}
              maxLength={15}
              autoFocus
              className={`w-full border-b-2 py-4 text-2xl sm:text-4xl font-extrabold tracking-tight bg-transparent transition-colors focus:outline-none placeholder:opacity-30 ${
                isDark
                  ? 'border-zinc-700 text-[#f2fdf4] placeholder:text-zinc-700 focus:border-[#d4f870]'
                  : 'border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#0a2e16]'
              }`}
            />
            {rawInput && (
              <button
                type="button"
                onClick={() => setRawInput('')}
                className={`absolute right-0 top-1/2 -translate-y-1/2 text-xs font-bold uppercase rounded-full px-3 py-1 border cursor-pointer ${
                  isDark
                    ? 'border-red-400/40 bg-red-950/40 text-red-300'
                    : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                Clear
              </button>
            )}
          </div>

          {hasPrefix && cleanNumber && (
            <p className="text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400 pt-1">
              NORMALIZED QUERY ID: <strong className="text-slate-900 dark:text-white">{cleanNumber}</strong>
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!cleanNumber || isLoading}
            className={`rounded-full px-8 py-4 font-extrabold text-sm tracking-wide transition-all cursor-pointer inline-flex items-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark
                ? 'bg-[#d4f870] text-[#07170c] hover:bg-[#dbf98d]'
                : 'bg-[#0a2e16] text-[#d4f870] hover:bg-[#06200f]'
            }`}
          >
            <span>{isLoading ? 'Querying Council Registry...' : 'Start Verification'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
