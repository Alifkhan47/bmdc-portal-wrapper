import React from 'react';
import { ArrowUpRight, Sun, Moon } from 'lucide-react';

export default function Header({ theme = 'dark', onToggleTheme, doctorType = 'MBBS' }) {
  const isDark = theme === 'dark';

  return (
    <header className={`w-full border-b transition-colors ${
      isDark ? 'border-[#d4f870]/15 bg-[#07170c] text-[#f2fdf4]' : 'border-slate-200 bg-white text-[#0a2e16]'
    } px-4 sm:px-8 py-3.5`}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            isDark ? 'bg-[#d4f870] text-[#07170c]' : 'bg-[#0a2e16] text-[#d4f870]'
          }`}>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold tracking-tight">BMDC Portal</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-[#11381d] text-[#d4f870] border border-[#d4f870]/30' : 'bg-[#dcf78a] text-[#0a2e16] border border-[#0a2e16]/15'
              }`}>
                VERIFIED
              </span>
            </div>
            <p className={`text-[11px] font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Bangladesh Medical & Dental Council
            </p>
          </div>
        </div>

        {/* Controls & Nav Links */}
        <div className="flex items-center space-x-4 self-end sm:self-center font-medium text-xs">
          <div className="flex items-center space-x-2 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className={isDark ? 'text-zinc-300' : 'text-slate-700'}>GATEWAY: LIVE</span>
          </div>

          <a
            href="https://verify.bmdc.org.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:inline-flex items-center space-x-1 hover:underline ${
              isDark ? 'text-[#d4f870]' : 'text-slate-700 hover:text-black'
            }`}
          >
            <span>Official Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            className={`rounded-full px-4 py-1.5 font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1.5 border ${
              isDark
                ? 'border-[#d4f870]/30 bg-[#11381d] text-[#d4f870] hover:bg-[#184e29]'
                : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            <span>{isDark ? 'LIGHT MODE' : 'DARK MODE'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
