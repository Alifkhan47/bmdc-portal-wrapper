import React from 'react';

export default function BmdcLogo({ theme = 'light', className = 'w-9 h-9' }) {
  const isDark = theme === 'dark';
  const bg = isDark ? '#d4f870' : '#0a2e16';
  const fg = isDark ? '#07170c' : '#d4f870';
  const accent = isDark ? '#0a2e16' : '#ffffff';

  return (
    <div className={`shrink-0 rounded-xl overflow-hidden transition-transform duration-200 group-hover:scale-105 shadow-xs ${className}`}>
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        aria-label="Bangladesh Medical & Dental Council Lettermark Logo"
      >
        {/* Background Squircle */}
        <rect width="36" height="36" rx="8" fill={bg} />

        {/* Subtle grid lines dividing the quadrants */}
        <line x1="18" y1="4" x2="18" y2="15" stroke={fg} strokeOpacity="0.15" strokeWidth="1" strokeDasharray="1 2" />
        <line x1="18" y1="21" x2="18" y2="32" stroke={fg} strokeOpacity="0.15" strokeWidth="1" strokeDasharray="1 2" />
        <line x1="4" y1="18" x2="15" y2="18" stroke={fg} strokeOpacity="0.15" strokeWidth="1" strokeDasharray="1 2" />
        <line x1="21" y1="18" x2="32" y2="18" stroke={fg} strokeOpacity="0.15" strokeWidth="1" strokeDasharray="1 2" />

        {/* B (Top-Left) */}
        <path
          d="M6.5 6.5H12.5C14.2 6.5 15.5 7.4 15.5 8.9C15.5 9.9 14.8 10.7 13.8 11.1C15 11.5 15.8 12.4 15.8 13.6C15.8 15.2 14.4 16.2 12.5 16.2H6.5V6.5ZM9 10.4H12C12.7 10.4 13.2 9.9 13.2 9.2C13.2 8.5 12.7 8.1 12 8.1H9V10.4ZM9 14.3H12.2C12.9 14.3 13.5 13.7 13.5 13C13.5 12.3 12.9 11.8 12.2 11.8H9V14.3Z"
          fill={fg}
        />

        {/* M (Top-Right) */}
        <path
          d="M20 6.5H22.3L24.1 12L25.9 6.5H28.2V16.2H26.1V10.2L24.6 14.4H23.7L22.2 10.2V16.2H20V6.5Z"
          fill={fg}
        />

        {/* D (Bottom-Left) */}
        <path
          d="M6.5 19.8H11.5C14.1 19.8 15.7 21.5 15.7 24.1C15.7 26.7 14.1 28.4 11.5 28.4H6.5V19.8ZM9 26.3H11.2C12.7 26.3 13.6 25.3 13.6 24.1C13.6 22.9 12.7 21.9 11.2 21.9H9V26.3Z"
          fill={fg}
        />

        {/* C (Bottom-Right) */}
        <path
          d="M28.2 21.8C27.5 20.6 26.2 19.8 24.4 19.8C21.7 19.8 19.9 21.7 19.9 24.1C19.9 26.5 21.7 28.4 24.4 28.4C26.2 28.4 27.5 27.6 28.2 26.4L26.3 25.2C25.9 25.9 25.3 26.4 24.4 26.4C23.1 26.4 22.3 25.4 22.3 24.1C22.3 22.8 23.1 21.8 24.4 21.8C25.3 21.8 25.9 22.3 26.3 23L28.2 21.8Z"
          fill={fg}
        />

        {/* Central Medical Cross (+) Emblem */}
        <rect x="16.75" y="15.25" width="2.5" height="5.5" rx="0.8" fill={accent} />
        <rect x="15.25" y="16.75" width="5.5" height="2.5" rx="0.8" fill={accent} />
      </svg>
    </div>
  );
}
