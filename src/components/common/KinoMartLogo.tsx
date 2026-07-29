import React from 'react';

interface KinoMartLogoProps {
  className?: string;
  showBg?: boolean;
}

export const KinoMartLogo: React.FC<KinoMartLogoProps> = ({ 
  className = "w-10 h-10",
  showBg = true 
}) => {
  return (
    <div className={`relative flex items-center justify-center rounded-xl overflow-hidden ${showBg ? 'bg-black p-1.5 shadow-md' : ''} ${className}`}>
      <svg viewBox="0 0 500 500" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top-left slanted bar - White */}
        <path d="M190 140 H280 L230 255 H165 Z" fill="#FFFFFF" />
        
        {/* Top-right diagonal arm - White */}
        <path d="M255 230 L395 140 H320 L210 220 Z" fill="#FFFFFF" />
        
        {/* Bottom-right diagonal leg - Olive Green */}
        <path d="M230 250 L380 335 H305 L195 275 Z" fill="#6B7A4F" />
        
        {/* Speed lines - Olive Green */}
        <rect x="90" y="250" width="55" height="13" rx="6.5" fill="#6B7A4F" />
        <rect x="120" y="273" width="40" height="13" rx="6.5" fill="#6B7A4F" />
        <rect x="70" y="296" width="65" height="13" rx="6.5" fill="#6B7A4F" />
        
        {/* Shopping Cart Body - Olive Green */}
        <path d="M135 250 H240 L195 310 H140 Z" fill="#6B7A4F" />
        
        {/* Cart Wheels - Olive Green */}
        <circle cx="155" cy="332" r="12" fill="#6B7A4F" />
        <circle cx="188" cy="332" r="12" fill="#6B7A4F" />
      </svg>
    </div>
  );
};
