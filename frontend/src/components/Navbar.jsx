import React from 'react';
import { Bell, Settings } from 'lucide-react';
import MagneticWrapper from './MagneticWrapper';

const Navbar = ({ onBellClick, onSettingsClick, onBrandClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
      <div
        onClick={onBrandClick}
        className="flex items-center gap-4 group cursor-pointer select-none"
      >
        <div className="relative p-3 bg-gradient-to-b from-[#2a0e35]/60 to-[#12041c]/90 border border-[#be185d]/30 rounded-[20px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all duration-500 group-hover:border-[#ec4899]/50">
          <div className="absolute inset-0 bg-[#db2777]/5 rounded-[19px] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <svg 
            className="w-5 h-5 text-[#f43f5e] relative z-10 transition-transform duration-700 group-hover:rotate-[360deg]" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 18s5.5-3 5.5-7V6.5L12 4.5 6.5 6.5V11c0 4 5.5 7 5.5 7z" className="opacity-60" strokeWidth="1.5" />
            <circle cx="12" cy="11" r="1" fill="#fff" stroke="none" />
          </svg>
        </div>

        <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2">
          <span className="text-xl font-serif font-bold tracking-wide text-[#fff5f9] drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
            HER
          </span>
          <span className="text-sm font-sans font-normal tracking-[0.25em] uppercase text-[#c0a2c7] opacity-90 transition-colors duration-300 group-hover:text-[#f472b6]">
            shield
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-medium">
          Shield Core Online
        </span>
      </div>

      <div className="flex items-center gap-4">
        <MagneticWrapper>
          <button
            onClick={onBellClick}
            className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10 text-pink-100/80 cursor-pointer"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-orchid" />
          </button>
        </MagneticWrapper>
        
        <MagneticWrapper>
          <button
            onClick={onSettingsClick}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10 text-pink-100/80 cursor-pointer"
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>
        </MagneticWrapper>
      </div>
    </header>
  );
};

export default Navbar;
