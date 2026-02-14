
import React from 'react';

interface LogoProps {
  className?: string;
  stacked?: boolean;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12", stacked, onClick }) => {
  return (
    <div 
      className={`flex items-center gap-3 transition-opacity ${onClick ? 'cursor-pointer hover:opacity-80 active:opacity-60' : ''} ${className}`}
      onClick={onClick}
    >
      {/* House Icon in Rounded Square */}
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="100" height="100" rx="22" fill="#5484E8" />
          <path d="M25 52L50 32L75 52V75H25V52Z" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="50" cy="42" r="3" fill="white" />
          <circle cx="38" cy="53" r="3" fill="white" fillOpacity="0.6" />
          <circle cx="62" cy="53" r="3" fill="white" fillOpacity="0.6" />
          <rect x="44" y="63" width="12" height="12" rx="2" fill="white" />
        </svg>
      </div>

      {/* Text Branding */}
      <div className={`flex flex-col ${stacked ? 'items-center' : ''}`}>
        <span className="font-bold text-xl md:text-2xl text-[#1F2020] leading-none tracking-tight">
          SmartLife
        </span>
        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-[#3A6AD6] mt-1">
          ELECTRONICS
        </span>
      </div>
    </div>
  );
};

export default Logo;
