import React from 'react';
import { AlertTriangle, Compass, X, ChevronRight } from 'lucide-react';

const SosOverlay = ({ sosCountdown, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/90 backdrop-blur-2xl transition-all duration-500 animate-[fadeIn_0.3s_ease-out]">
      {/* Pulsing Alarm Glow Rings */}
      <div className="absolute inset-0 bg-gradient-to-tr from-neon-orchid/15 via-red-900/10 to-transparent animate-pulse pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-neon-orchid/10 blur-[140px] pointer-events-none" />
      
      {/* Main SOS Dialog Card */}
      <div className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/10 max-w-xl w-full mx-4 shadow-[0_25px_60px_rgba(217,70,239,0.15)] relative overflow-hidden text-center flex flex-col items-center">
        
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Danger Warning Alert Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs tracking-wider uppercase font-medium mb-8">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          Simulated Safety Dispatch
        </div>

        {/* Circular Countdown Progress Ring */}
        <div className="relative flex items-center justify-center w-36 h-36 md:w-40 md:h-40 mb-8">
          {/* Spinning background track */}
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="70"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="70"
              stroke="#D946EF"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="440"
              strokeDashoffset={440 - (440 * (5 - sosCountdown)) / 5}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          {/* Inner details */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-5xl font-serif font-bold text-white tracking-tighter">
              {sosCountdown > 0 ? sosCountdown : '0'}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-pink-200/50 mt-1">
              Seconds
            </span>
          </div>
        </div>

        <h2 className="font-serif text-3xl text-white tracking-wide mb-3">
          {sosCountdown > 0 ? 'Broadcasting Sanctuary Signal' : 'Signal Broadcast Complete'}
        </h2>
        <p className="text-sm font-sans font-light text-pink-100/60 leading-relaxed max-w-sm mb-8">
          {sosCountdown > 0 
            ? 'Your trusted circle and local security nodes will receive your telemetry details in real-time unless cancelled.'
            : 'All synced guardians are notified. Live recording and telemetry packet sent.'
          }
        </p>

        {/* Live Telemetry Data Feed inside Alert */}
        <div className="w-full bg-white/2 border border-white/5 rounded-2xl p-5 mb-8 text-left text-xs font-mono tracking-wider space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-pink-100/30">DISPATCH TYPE</span>
            <span className="text-neon-orchid font-semibold">PRIORITY ALPHA SOS</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-pink-100/30">GPS TELEMETRY</span>
            <span className="text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 animate-spin" />
              37.7749° N, 122.4194° W
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-pink-100/30">TRUSTED CIRCLE</span>
            <span className="text-white">NOTIFYING 4 ACTIVE NODES</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <span className="text-pink-100/30">LOCAL DISPATCH</span>
            <span className="text-emerald-400">READY FOR HANDSHAKE</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={onCancel}
            className="flex-1 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 text-white font-medium transition-all duration-300 active:scale-98 cursor-pointer"
          >
            Cancel Alert
          </button>
          <button 
            className="flex-1 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-neon-orchid to-purple-600 text-white font-medium hover:brightness-110 shadow-lg shadow-neon-orchid/20 transition-all duration-300 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            Immediate Connect
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SosOverlay;
