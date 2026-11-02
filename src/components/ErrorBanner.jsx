import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBanner({ message, onRetry, theme = 'dark' }) {
  const isDark = theme === 'dark';

  return (
    <div className={`w-full border rounded-3xl p-6 sm:p-8 space-y-6 transition-colors ${
      isDark ? 'border-red-500/40 bg-red-950/20 text-red-100' : 'border-red-600/30 bg-red-50 text-red-950'
    }`}>
      <div className="flex items-center justify-between border-b pb-3 font-mono text-xs border-inherit">
        <div className="flex items-center space-x-2 font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <span>NOTICE // QUERY EXECUTION UNSUCCESSFUL</span>
        </div>
        <span className="font-bold opacity-70 font-mono">STATUS: FAILED</span>
      </div>

      <div className="space-y-2">
        <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
          No Matching Records Retrieved
        </h4>
        <p className={`text-sm font-mono leading-relaxed ${isDark ? 'text-red-200/80' : 'text-red-900'}`}>
          {message || 'An error occurred or no matching registered practitioner was found on the official council registry.'}
        </p>
      </div>

      <div className="pt-2 font-mono text-xs">
        <button
          onClick={onRetry}
          className="rounded-full px-6 py-3 font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Verification</span>
        </button>
      </div>
    </div>
  );
}
