import React, { useState } from 'react';

const TriggerCard = ({
  title,
  subtitle,
  description,
  icon: Icon,
  animationClass = 'animate-float-medium',
  customContent,
  isActive = false,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-panel glass-panel-glow relative flex flex-col p-8 rounded-3xl cursor-pointer select-none transition-all duration-700 ${animationClass} ${isHovered
          ? 'translate-y-[-8px] scale-[1.02] border-white/20 bg-white/5 shadow-[0_20px_50px_rgba(255,240,245,0.08)]'
          : 'border-white/8 hover:translate-y-[-8px]'
        }`}
    >
      {/* Top Card Lighting Glow */}
      <div
        className={`absolute -top-12 left-1/4 w-1/2 h-20 bg-gradient-to-b from-pink-300/10 via-purple-500/5 to-transparent blur-xl transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-40'
          }`}
      />

      {/* Header Info */}
      <div className="flex items-start justify-between mb-6 z-10">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors duration-500">
          {Icon && <Icon className={`w-6 h-6 transition-all duration-500 ${isHovered ? 'text-neon-orchid scale-110' : 'text-pink-100/90'}`} />}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-pink-200/50 font-sans font-light">
            {subtitle}
          </span>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? 'bg-neon-orchid' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-neon-orchid' : 'bg-emerald-400'}`}></span>
          </span>
        </div>
      </div>

      {/* Text Info */}
      <div className="flex flex-col mb-6 z-10">
        <h3 className="text-xl font-serif font-semibold text-white tracking-wide mb-2 group-hover:text-neon-orchid transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm font-sans font-light text-pink-100/70 leading-relaxed min-h-[40px]">
          {description}
        </p>
      </div>

      {/* Card Dynamic Area (Custom Content) */}
      <div className="mt-auto z-10 w-full">
        {customContent}
      </div>

      {/* Card Border Glow */}
      <div className={`absolute inset-0 rounded-3xl border border-transparent transition-all duration-700 pointer-events-none ${isHovered ? 'bg-gradient-to-r from-neon-orchid/20 via-pink-300/10 to-indigo-500/20 [mask-image:linear-gradient(to_bottom,white,transparent)]' : ''
        }`} />
    </div>
  );
};

export default TriggerCard;