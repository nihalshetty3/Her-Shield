import React from 'react';

const GestureVisual = ({ isHovered, isActive }) => {
  return (
    <div className="relative w-full h-24 flex items-center justify-center overflow-hidden bg-white/2 rounded-2xl border border-white/5">
      {/* Motion ring pulses */}
      <div className={`absolute w-12 h-12 rounded-full border border-pink-400/20 transition-all duration-1000 ${
        isHovered || isActive ? 'scale-[1.8] opacity-0' : 'scale-50 opacity-100'
      }`} />
      <div className={`absolute w-16 h-16 rounded-full border border-purple-400/10 transition-all duration-700 ${
        isHovered || isActive ? 'scale-[2.2] opacity-0' : 'scale-75 opacity-100'
      }`} />
      
      {/* Shaking phone silhouette */}
      <div className={`transition-transform duration-300 ${
        isHovered || isActive ? 'animate-[bounce_0.6s_infinite] rotate-12' : 'animate-[pulse_3s_infinite]'
      }`}>
        <div className="w-8 h-14 rounded-lg border-2 border-white/40 p-1 flex flex-col justify-between items-center bg-midnight/80 shadow-[inset_0_0_8px_rgba(255,255,255,0.15)]">
          <div className="w-3 h-0.5 bg-white/30 rounded-full" />
          <div className={`w-2.5 h-2.5 rounded-full border border-neon-orchid/70 transition-all duration-300 ${
            isActive ? 'bg-neon-orchid shadow-[0_0_8px_rgba(217,70,239,0.8)]' : 'bg-white/10'
          }`} />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="absolute bottom-2 text-[9px] tracking-widest uppercase font-mono text-pink-200/40">
        {isActive ? 'G-Sensor Active' : 'Tap to Enable'}
      </div>
    </div>
  );
};

export default GestureVisual;
