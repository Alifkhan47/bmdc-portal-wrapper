import React from 'react';

export default function LoadingSkeleton({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  return (
    <div className={`w-full space-y-6 animate-pulse transition-colors ${
      isDark ? 'text-zinc-200' : 'text-slate-800'
    }`}>
      {/* 1. Header Skeleton Card */}
      <div className={`border rounded-3xl p-6 sm:p-10 space-y-6 ${
        isDark ? 'border-zinc-800 bg-[#0f1411]' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex items-center justify-between border-b pb-4 border-inherit">
          <div className={`h-6 w-36 rounded-full ${isDark ? 'bg-zinc-800/80' : 'bg-slate-200'}`}></div>
          <div className={`h-6 w-24 rounded-full ${isDark ? 'bg-zinc-800/80' : 'bg-slate-200'}`}></div>
        </div>

        <div className="space-y-3">
          <div className={`h-3 w-40 rounded-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`}></div>
          <div className={`h-12 sm:h-16 w-3/4 max-w-xl rounded-2xl ${isDark ? 'bg-zinc-800/80' : 'bg-slate-200'}`}></div>
          <div className="flex items-center space-x-3 pt-2">
            <div className={`h-7 w-32 rounded-full ${isDark ? 'bg-zinc-800/70' : 'bg-slate-200'}`}></div>
            <div className={`h-7 w-28 rounded-full ${isDark ? 'bg-zinc-800/70' : 'bg-slate-200'}`}></div>
          </div>
        </div>
      </div>

      {/* 2. Media Row Skeleton Card */}
      <div className={`border rounded-3xl p-6 sm:p-10 space-y-6 ${
        isDark ? 'border-zinc-800 bg-[#0f1411]' : 'border-slate-200 bg-white'
      }`}>
        <div className={`h-4 w-48 rounded-full ${isDark ? 'bg-zinc-800/70' : 'bg-slate-200'}`}></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className={`aspect-[4/5] rounded-2xl border ${isDark ? 'border-zinc-800/70 bg-zinc-900/60' : 'border-slate-200 bg-slate-100'}`}></div>
            <div className={`h-3 w-28 rounded-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`}></div>
          </div>
          <div className="space-y-2">
            <div className={`aspect-[4/5] rounded-2xl border ${isDark ? 'border-zinc-800/70 bg-zinc-900/60' : 'border-slate-200 bg-slate-100'}`}></div>
            <div className={`h-3 w-28 rounded-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`}></div>
          </div>
          <div className="space-y-2">
            <div className={`aspect-square rounded-2xl border ${isDark ? 'border-zinc-800/70 bg-zinc-900/60' : 'border-slate-200 bg-slate-100'}`}></div>
            <div className={`h-3 w-28 rounded-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`}></div>
          </div>
        </div>
      </div>

      {/* 3. Data Grid Skeleton Card */}
      <div className={`border rounded-3xl p-6 sm:p-10 space-y-6 ${
        isDark ? 'border-zinc-800 bg-[#0f1411]' : 'border-slate-200 bg-white'
      }`}>
        <div className={`h-4 w-48 rounded-full ${isDark ? 'bg-zinc-800/70' : 'bg-slate-200'}`}></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-inherit pt-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className={`h-3 w-24 rounded-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`}></div>
              <div className={`h-8 w-32 rounded-xl ${isDark ? 'bg-zinc-800/80' : 'bg-slate-200'}`}></div>
            </div>
            <div className="space-y-2 border-t border-inherit pt-4">
              <div className={`h-3 w-32 rounded-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`}></div>
              <div className={`h-8 w-36 rounded-xl ${isDark ? 'bg-zinc-800/80' : 'bg-slate-200'}`}></div>
            </div>
          </div>

          <div className="space-y-6 md:pl-8">
            <div className="space-y-2">
              <div className={`h-3 w-24 rounded-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`}></div>
              <div className={`h-8 w-48 rounded-xl ${isDark ? 'bg-zinc-800/80' : 'bg-slate-200'}`}></div>
            </div>
            <div className="space-y-2 border-t border-inherit pt-4">
              <div className={`h-3 w-24 rounded-full ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`}></div>
              <div className={`h-8 w-48 rounded-xl ${isDark ? 'bg-zinc-800/80' : 'bg-slate-200'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
