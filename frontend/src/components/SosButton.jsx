import React from 'react';
import { ShieldAlert } from 'lucide-react';

const SosButton = ({ isHovered, isActive }) => {
  return (
    <div className="relative w-full h-24 flex items-center justify-center overflow-hidden bg-white/2 rounded-2xl border border-white/5">
      {/* Glow pulse ring under hover */}
      <div className={`absolute w-14 h-14 rounded-full bg-gradient-to-tr from-neon-orchid to-purple-600 blur-xl opacity-30 transition-all duration-700 ${isHovered ? 'scale-130 opacity-60' : 'scale-90'
        }`} />

      {/* Simulated luxury glass trigger button */}
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full border border-white/15 bg-white/5 shadow-inner hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-pink-400/20 via-purple-500/10 to-transparent animate-pulse" />
        <ShieldAlert className="w-5 h-5 text-neon-orchid animate-pulse" />
      </div>

      <div className="absolute bottom-2 text-[9px] tracking-widest uppercase font-mono text-pink-200/40">
        Tap to Simulate
      </div>
    </div>
  );
};

export default SosButton;
