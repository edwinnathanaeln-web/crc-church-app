// src/components/Logo.tsx
'use client';

import React from 'react';

export const Logo: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Eagle wings with cross in negative space */}
      <path
        d="M50 20 L30 35 Q25 40 20 50 L20 55 Q25 60 30 65 L50 80 L70 65 Q75 60 80 55 L80 50 Q75 40 70 35 L50 20 Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Cross in center (negative space) */}
      <rect x="47" y="30" width="6" height="40" fill="var(--bg-color)" />
      <rect x="35" y="47" width="30" height="6" fill="var(--bg-color)" />
      {/* Eagle head */}
      <circle cx="50" cy="25" r="8" fill="currentColor" />
      <path d="M55 22 L60 20 L58 25 Z" fill="var(--accent-color)" />
    </svg>
  );
};

export const LogoText: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <Logo size={40} />
      <div className="flex flex-col">
        <h1 className="font-playfair text-xl font-bold tracking-wide">
          CHRIST RESTORATION
        </h1>
        <p className="font-playfair text-sm tracking-widest opacity-90">CENTRE</p>
      </div>
    </div>
  );
};
