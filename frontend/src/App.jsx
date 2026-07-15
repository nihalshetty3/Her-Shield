import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Mic,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuraCore from './components/AuraCore';
import TriggerCard from './components/TriggerCard';
import GestureVisual from './components/GestureVisual';
import VoiceVisual from './components/VoiceVisual';
import SosButton from './components/SosButton';
import SosOverlay from './components/SosOverlay';
import AudioTestPanel from './components/AudioTestPanel';
import ProfilePage from './pages/ProfilePage';
import GuardianLayout from './pages/GuardianLayout';

function DashboardView() {
  const navigate = useNavigate();
  const [gestureActive, setGestureActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);

  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    let timer;
    if (sosActive && sosCountdown > 0) {
      timer = setTimeout(() => {
        setSosCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [sosActive, sosCountdown]);

  const triggerSos = () => {
    setSosActive(true);
    setSosCountdown(5);
  };

  const cancelSos = () => {
    setSosActive(false);
    setSosCountdown(5);
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col bg-midnight m-0 p-0 overflow-y-auto overflow-x-hidden relative font-sans text-blush/90 selection:bg-neon-orchid selection:text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-purple-900/20 via-pink-900/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-neon-orchid/5 blur-[160px] pointer-events-none" />

        <Navbar
          onBellClick={() => console.log('Bell Clicked')}
          onSettingsClick={() => navigate('/profile')}
          onBrandClick={() => navigate('/')}
        />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col items-center justify-center text-center space-y-6">

          <section className="text-center w-full max-w-3xl flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-orchid/10 border border-neon-orchid/20 text-neon-orchid text-xs tracking-wider uppercase font-medium mb-6 animate-float-fast">
              <Sparkles className="w-3.5 h-3.5" />
              Empowered by Cognitive Safety AI
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-wide leading-[1.15] mb-6">
              Your Invisible Shield.<br />
              <span className="italic font-light text-pink-100/90">Always Aware</span>, Always Protecting.
            </h1>
            <p className="text-base sm:text-lg font-sans font-light text-pink-100/60 leading-relaxed max-w-2xl mx-auto px-4">
              A premium safety ecosystem that utilizes intelligent gesture sensing and context-aware audio monitoring to form a protective shield around your journey.
            </p>
          </section>

          <section className="flex flex-col items-center justify-center relative w-full">
            <AuraCore />
            <p className="text-[11px] tracking-[0.3em] uppercase text-pink-100/40 mt-4 animate-pulse">
              Tap core to simulate quick SOS
            </p>
          </section>

          <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center justify-center items-center text-center mx-auto">

            <div
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              className="flex flex-col"
            >
              <TriggerCard
                title="Gesture Trigger"
                subtitle="SHAKE SENSING"
                description="Instantly registers rapid spatial movements or shake gestures to trigger protection sequences silently."
                icon={Smartphone}
                animationClass="animate-float-slow md:translate-y-4"
                isActive={gestureActive}
                onClick={() => setGestureActive(!gestureActive)}
                customContent={
                  <GestureVisual
                    isHovered={hoveredCard === 1}
                    isActive={gestureActive}
                  />
                }
              />
            </div>

            <div
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              className="flex flex-col"
            >
              <TriggerCard
                title="Voice Guardian"
                subtitle="WHISPER AI COGNITION"
                description="Continuous local listening detects distress keywords and safety acoustics under extreme privacy protection."
                icon={Mic}
                animationClass="animate-float-medium md:translate-y-[-12px]"
                isActive={voiceActive}
                onClick={() => setVoiceActive(!voiceActive)}
                customContent={
                  <VoiceVisual
                    isHovered={hoveredCard === 2}
                    isActive={voiceActive}
                  />
                }
              />
            </div>

            <div
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
              className="flex flex-col"
            >
              <TriggerCard
                title="One-Tap Sanctuary"
                subtitle="INSTANT BROADCAST"
                description="Main physical SOS mechanism. Creates an encrypted emergency hub routing live metrics instantly."
                icon={ShieldAlert}
                animationClass="animate-float-fast md:translate-y-8"
                isActive={false}
                onClick={triggerSos}
                customContent={
                  <SosButton
                    isHovered={hoveredCard === 3}
                    isActive={sosActive}
                  />
                }
              />
            </div>

          </section>

          <section className="w-full">
            <AudioTestPanel />
          </section>

        </main>

        <footer className="w-full mt-auto border-t border-slate-800/40 bg-[#0c0517]/90 py-4 px-6 mb-0 pb-4 flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-wider uppercase text-pink-100/40 gap-4">
          <span>Aura Guard © 2026. Made with Absolute Care.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neon-orchid transition-colors">Privacy Shield</a>
            <a href="#" className="hover:text-neon-orchid transition-colors">Legal dispatch compliance</a>
          </div>
        </footer>
      </div>

      {sosActive && (
        <SosOverlay
          sosCountdown={sosCountdown}
          onCancel={cancelSos}
        />
      )}
    </>
  );
}

function ProfilePageWrapper() {
  const navigate = useNavigate();
  return <ProfilePage onBack={() => navigate('/')} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/profile" element={<ProfilePageWrapper />} />
        <Route path="/guardian" element={<GuardianLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
