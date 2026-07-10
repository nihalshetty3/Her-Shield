import React from 'react';
import { Shield, Bell, Settings } from 'lucide-react';

const Navbar = ({ onBellClick, onSettingsClick, onBrandClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-6 md:px-12 py-5 flex items-center justify-between">
      <div 
        onClick={onBrandClick}
        className="flex items-center gap-3 cursor-pointer hover:opacity-95 transition-opacity"
      >
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-orchid/20 to-pink-500/20 border border-white/10">
          <Shield className="w-5 h-5 text-neon-orchid" />
          <div className="absolute -inset-0.5 rounded-2xl bg-neon-orchid/30 blur opacity-30 animate-pulse" />
        </div>
        <span className="font-sans font-semibold text-lg tracking-[0.2em] text-white">
          AURA<span className="text-neon-orchid font-light">GUARD</span>
        </span>
      </div>

      {/* System Active Banner */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-medium">
          Shield Core Online
        </span>
      </div>

      {/* Settings / Controls */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBellClick}
          className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10 text-pink-100/80 cursor-pointer"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-orchid" />
        </button>
        <button 
          onClick={onSettingsClick}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10 text-pink-100/80 cursor-pointer"
        >
          <Settings className="w-[18px] h-[18px]" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
