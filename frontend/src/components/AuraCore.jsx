import React, { useState } from 'react';

const AuraCore = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Deepest Ambient Glow */}
      <div 
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-pink-400 to-indigo-500 blur-3xl opacity-30 transition-all duration-1000 ${
          isHovered ? 'scale-125 opacity-55' : 'scale-100'
        }`}
      />

      {/* Middle Neon Core Halo */}
      <div 
        className={`absolute w-[110%] h-[110%] rounded-full bg-gradient-to-r from-neon-orchid/30 to-purple-500/20 blur-2xl transition-all duration-700 ${
          isHovered ? 'animate-pulse-glow scale-105 opacity-80' : 'opacity-40'
        }`}
      />

      {/* Floating Outer Glass Ring */}
      <div 
        className={`absolute inset-0 rounded-full border border-white/10 backdrop-blur-xl transition-all duration-1000 ${
          isHovered ? 'scale-105 border-white/20 rotate-45' : 'scale-95'
        }`}
      />

      {/* The Organic Morphing Orb Core */}
      <div 
        className={`absolute w-60 h-60 md:w-64 md:h-64 animate-orb-morph overflow-hidden border border-white/25 glass-panel transition-all duration-700 bg-gradient-to-tr from-pink-300/30 via-purple-400/20 to-indigo-300/20 ${
          isHovered 
            ? 'border-white/40 scale-102 filter brightness-110 drop-shadow-[0_0_35px_rgba(217,70,239,0.5)]' 
            : 'drop-shadow-[0_0_20px_rgba(255,240,245,0.25)]'
        }`}
      >
        {/* Swirling Inner Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 via-transparent to-purple-600/35 mix-blend-color-dodge animate-pulse" />
        
        {/* Soft Liquid Reflection Overlay */}
        <div className="absolute top-2 left-8 w-24 h-12 bg-white/20 rounded-full blur-[2px] transform -rotate-12 mix-blend-overlay" />
        <div className="absolute bottom-6 right-10 w-16 h-8 bg-white/10 rounded-full blur-[4px] transform rotate-45 mix-blend-overlay" />
        
        {/* AI Radar Pulse Indicator Rings */}
        <div className={`absolute inset-12 rounded-full border border-pink-200/20 transition-all duration-700 ${
          isHovered ? 'scale-110 border-pink-200/40' : 'scale-100'
        }`} />
        <div className={`absolute inset-20 rounded-full border border-purple-300/25 transition-all duration-700 ${
          isHovered ? 'scale-90 border-purple-300/50' : 'scale-100'
        }`} />
      </div>

      {/* Center status label */}
      <div className="absolute flex flex-col items-center justify-center text-center z-10 select-none">
        <span className="text-xs uppercase tracking-[0.25em] text-pink-200/70 font-sans font-light mb-1">
          Aura Presence
        </span>
        <span className="text-lg font-serif font-semibold text-white transition-all duration-300 group-hover:text-neon-orchid">
          {isHovered ? 'Always Aware' : 'Active'}
        </span>
        {/* Pulse status indicator dot */}
        <div className="mt-3 flex items-center justify-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-orchid opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-orchid"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuraCore;
