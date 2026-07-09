import React, { useState, useEffect } from 'react';
import useShakeDetector from '../hooks/useShakeDetector';

const GestureVisual = ({ isHovered, isActive }) => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isSensorEnabled, setIsSensorEnabled] = useState(false);
  const [isSosTriggered, setIsSosTriggered] = useState(false);

  useEffect(() => {
    if (typeof DeviceMotionEvent === 'undefined' || typeof DeviceMotionEvent.requestPermission !== 'function') {
      setIsPermissionGranted(true);
    }
  }, []);

  const fireSosBackend = () => {
    fetch('http://localhost:5001/api/trigger-sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'gesture-shake' })
    })
      .then((res) => res.json())
      .then((data) => console.log('[Gesture Network Sync] Broadcast Confirmed:', data))
      .catch((err) => console.error('[Gesture Network Sync] Network pipeline broken:', err));
  };

  const handleTrigger = () => {
    setIsSosTriggered(true);
    fireSosBackend();
  };

  useShakeDetector(handleTrigger, isSensorEnabled);

  const requestDeviceMotionPermission = () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            setIsPermissionGranted(true);
            console.log('Sensor access granted successfully');
          } else {
            console.warn('Sensor access denied');
          }
        })
        .catch(err => {
          console.error('Sensor permission request error:', err);
        });
    } else {
      setIsPermissionGranted(true);
    }
  };

  const handleToggleSensor = (e) => {
    e.stopPropagation();
    if (isSensorEnabled) {
      setIsSensorEnabled(false);
    } else {
      requestDeviceMotionPermission();
      setIsSensorEnabled(true);
    }
  };

  const handleSimulateFlashTrigger = (e) => {
    e.stopPropagation();
    handleTrigger();
  };

  const handleResetTerminal = (e) => {
    e.stopPropagation();
    setIsSosTriggered(false);
  };

  const visualActive = isActive || isSosTriggered;

  return (
    <div 
      className={`relative w-full min-h-[120px] p-4 flex flex-col items-center justify-center overflow-hidden bg-white/2 rounded-2xl border transition-all duration-500 ${
        isSosTriggered 
          ? 'border-red-500/40 brightness-110 drop-shadow-[0_0_30px_rgba(239,68,68,0.55)]' 
          : 'border-white/5'
      }`}
    >
      <div className="absolute top-2 right-2 flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
          isSosTriggered ? 'bg-red-500' : 'bg-emerald-400'
        }`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${
          isSosTriggered ? 'bg-red-500' : 'bg-emerald-400'
        }`}></span>
      </div>

      <div className={`absolute w-12 h-12 rounded-full border border-pink-400/20 transition-all duration-1000 ${
        isHovered || visualActive ? 'scale-[1.8] opacity-0' : 'scale-50 opacity-100'
      }`} />
      <div className={`absolute w-16 h-16 rounded-full border border-purple-400/10 transition-all duration-700 ${
        isHovered || visualActive ? 'scale-[2.2] opacity-0' : 'scale-75 opacity-100'
      }`} />
      
      <div className={`transition-transform duration-300 mt-2 mb-2 ${
        isHovered || visualActive ? 'animate-[bounce_0.6s_infinite] rotate-12' : 'animate-[pulse_3s_infinite]'
      }`}>
        <div className="w-8 h-14 rounded-lg border-2 border-white/40 p-1 flex flex-col justify-between items-center bg-midnight/80 shadow-[inset_0_0_8px_rgba(255,255,255,0.15)]">
          <div className="w-3 h-0.5 bg-white/30 rounded-full" />
          <div className={`w-2.5 h-2.5 rounded-full border border-neon-orchid/70 transition-all duration-300 ${
            visualActive ? 'bg-neon-orchid shadow-[0_0_8px_rgba(217,70,239,0.8)]' : 'bg-white/10'
          }`} />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="text-[9px] tracking-widest uppercase font-mono text-pink-200/40 mb-2">
        {visualActive ? 'G-Sensor Active' : 'Tap to Enable'}
      </div>

      <div className="flex flex-col gap-2 w-full mt-2 z-20">
        <button
          onClick={handleToggleSensor}
          className={`w-full py-1.5 px-3 rounded-lg text-[10px] tracking-widest uppercase font-mono transition-all duration-300 cursor-pointer text-center ${
            isSensorEnabled 
              ? 'border border-neon-orchid/50 text-neon-orchid bg-neon-orchid/10 shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:bg-neon-orchid/20' 
              : 'border border-white/10 text-white/70 hover:bg-white/5'
          }`}
        >
          {isSensorEnabled ? '🔒 Disable Sensor' : '🔓 Enable Sensor'}
        </button>
        <span
          onClick={handleSimulateFlashTrigger}
          className="w-full text-center text-[9px] text-pink-300/60 hover:text-pink-400 font-mono tracking-wide underline cursor-pointer duration-300"
        >
          Simulate Instant Flash Trigger
        </span>
      </div>

      {isSosTriggered && (
        <div className="fixed inset-0 z-50 bg-red-600 flex flex-col items-center justify-center text-center p-8 select-none">
          <div className="max-w-md flex flex-col items-center">
            <span className="text-sm tracking-[0.25em] font-mono text-white font-bold mb-4 uppercase animate-pulse">
              🚨 EMERGENCY CRITICAL ALERT
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-wide leading-tight mb-8">
              SOS BROADCASTED.<br />CONTACTS NOTIFIED.
            </h1>
            <button
              onClick={handleResetTerminal}
              className="px-8 py-4 rounded-2xl bg-white text-red-600 font-serif font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-98 shadow-2xl cursor-pointer"
            >
              Reset Terminal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestureVisual;
