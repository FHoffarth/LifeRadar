import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const LifeRadarLogoMark: React.FC<LogoProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Open circular radar form */}
      <path d="M21 12a9 9 0 1 1-9-9" />
      
      {/* Two restrained concentric arcs */}
      <path d="M12 8a4 4 0 0 1 4 4" />
      <path d="M12 5a7 7 0 0 1 7 7" />
      
      {/* Short diagonal sweep direction */}
      <path d="M12 12l3.5-3.5" />
      
      {/* Subtle center point */}
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      
      {/* Detected signal point */}
      <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
};

export const BrandLockup: React.FC<{ className?: string, size?: 'sm' | 'md' }> = ({ className = '', size = 'md' }) => {
  const isSmall = size === 'sm';
  return (
    <div className={`flex items-center gap-${isSmall ? '2' : '3'} ${className}`}>
      <div className={`rounded-${isSmall ? 'md' : 'lg'} bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0 ${isSmall ? 'w-7 h-7' : 'w-8 h-8'}`}>
        <LifeRadarLogoMark size={isSmall ? 16 : 18} />
      </div>
      <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${isSmall ? 'text-lg' : 'text-xl'}`}>
        LifeRadar
      </span>
    </div>
  );
};
