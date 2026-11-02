import React from 'react';
import { ArrowUpRight, Sun, Moon } from 'lucide-react';
import BmdcLogo from './BmdcLogo';

export default function Header({ theme = 'dark', onToggleTheme, doctorType = 'MBBS', onHomeClick }) {
  const isDark = theme === 'dark';

  return (
    <header className={`w-full border-b transition-colors ${
      isDark ? 'border-[#d4f870]/15 bg-[#07170c] text-[#f2fdf4]' : 'border-slate-200 bg-white text-[#0a2e16]'
    } px-4 sm:px-8 py-3.5`}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand Logo & Title (Clickable Home Action) */}
        <button
          type="button"
          onClick={onHomeClick}
          className="flex items-center space-x-3 text-left cursor-pointer group transition-opacity hover:opacity-85 focus:outline-none"
          title="Return to search homepage"
        >
          <BmdcLogo theme={theme} className="w-9 h-9" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold tracking-tight group-hover:underline">BMDC Portal</span>
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
        </button>

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
