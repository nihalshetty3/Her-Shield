import React from 'react';

const VoiceVisual = ({ isHovered, isActive }) => {
  const waveHeights = [0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3, 0.6, 0.5];

  return (
    <div className="relative w-full h-24 flex items-center justify-center gap-[5px] overflow-hidden bg-white/2 rounded-2xl border border-white/5 px-6">
      {waveHeights.map((height, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-500 bg-gradient-to-t ${
            isActive 
              ? 'from-purple-500 via-pink-400 to-neon-orchid' 
              : 'from-pink-100/10 to-pink-100/20'
          }`}
          style={{
            height: isActive 
              ? (isHovered ? `${height * 65 + 10}px` : `${height * 35 + 15}px`) 
              : '10px',
            animation: isActive 
              ? `wave-bar 1.2s ease-in-out infinite alternate ${i * 0.12}s` 
              : 'none'
          }}
        />
      ))}

      <div className="absolute bottom-2 text-[9px] tracking-widest uppercase font-mono text-pink-200/40">
        {isActive ? 'Listening Ambiently' : 'Voice Paused'}
      </div>
    </div>
  );
};

export default VoiceVisual;
