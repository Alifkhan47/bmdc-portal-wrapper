import React from 'react';

export default function Header({ currentView = 'idle', onHomeClick }) {
  const isSearchActive = currentView === 'idle' || currentView === 'initializing';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-b border-on-surface/10">
      <div className="h-20 w-full max-w-5xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Brand & Verification Pulse */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={onHomeClick}
            className="flex items-baseline gap-2 group text-left cursor-pointer focus:outline-none"
            title="Return to practitioner search"
          >
            <span className="font-bold text-xl tracking-tight text-primary font-sans group-hover:opacity-75 transition-opacity">
              BMDC
            </span>
            <span className="hidden md:inline-block font-label-code text-secondary tracking-widest uppercase">
              / PUBLIC REGISTRY
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim inline-block animate-pulse"></span>
            <span className="font-label-code text-on-surface-variant uppercase tracking-wider">
              SYSTEM VERIFIED
            </span>
          </div>
        </div>

        {/* Right: Clean Text Navigation (No Profile Avatar) */}
        <nav className="flex items-center gap-5 sm:gap-8">
          <button
            type="button"
            onClick={onHomeClick}
            className={`font-label-caps uppercase tracking-widest transition-colors cursor-pointer ${
              isSearchActive
                ? 'text-primary font-bold underline decoration-1 underline-offset-8'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            SEARCH
          </button>

          <a
            href="https://verify.bmdc.org.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-label-caps uppercase text-on-surface-variant hover:text-on-surface transition-colors tracking-widest"
          >
            DIRECTORY
          </a>

          <div className="hidden sm:flex items-center gap-1.5 font-label-code text-secondary tracking-widest uppercase">
            <span>PROTOCOL</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-secondary-container rounded text-on-secondary-container">
              v4.12
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
