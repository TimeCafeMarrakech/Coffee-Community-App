import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="saffron-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8B831" />
          <stop offset="50%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#B3850F" />
        </linearGradient>
        <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2B2321" floodOpacity="0.15" />
        </filter>
      </defs>
      
      <path
        d="M 40 100 C 40 30, 90 30, 100 100 C 110 170, 160 170, 160 100 C 160 30, 110 30, 100 100 C 90 170, 40 170, 40 100 Z"
        stroke="url(#saffron-gradient)"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logo-shadow)"
      />
    </svg>
  );
};
