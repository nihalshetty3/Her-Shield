import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Mic, 
  ShieldAlert, 
  Users, 
  Volume2, 
  Lock, 
  MapPin, 
  Sparkles
} from 'lucide-react';
import Navbar from './components/Navbar';
import AuraCore from './components/AuraCore';
import TriggerCard from './components/TriggerCard';
import GestureVisual from './components/GestureVisual';
import VoiceVisual from './components/VoiceVisual';
import SosButton from './components/SosButton';
import SosOverlay from './components/SosOverlay';
import AudioTestPanel from './components/AudioTestPanel';
import ProfilePage from './pages/ProfilePage';
import GuardianChat from './components/GuardianChat';
import IncidentDashboard from './components/IncidentDashboard';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [gestureActive, setGestureActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  
  // Custom states for hovering triggers
  const [hoveredCard, setHoveredCard] = useState(null);

  // Countdown timer for SOS
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
      {currentView === 'profile' ? (
        <ProfilePage onBack={() => setCurrentView('dashboard')} />
      ) : (
        <div className="relative min-h-screen bg-midnight font-sans text-blush/90 overflow-hidden flex flex-col selection:bg-neon-orchid selection:text-white">
          {/* Decorative Blur Background Particles */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-purple-900/20 via-pink-900/10 to-transparent blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-neon-orchid/5 blur-[160px] pointer-events-none" />

          {/* Modular Navbar */}
          <Navbar 
            onBellClick={() => console.log('Bell Clicked')} 
            onSettingsClick={() => setCurrentView('profile')} 
            onBrandClick={() => setCurrentView('dashboard')}
          />

          {/* Main Page Layout */}
          <main className="flex-1 flex flex-col items-center px-6 md:px-12 py-10 max-w-7xl w-full mx-auto z-10">
            
            {/* Hero Section */}
            <section className="text-center max-w-3xl mt-4 mb-8">
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

            <section className="flex flex-col items-center justify-center my-8 relative">
              <AuraCore />
              <p className="text-[11px] tracking-[0.3em] uppercase text-pink-100/40 mt-4 animate-pulse">
                Tap core to simulate quick SOS
              </p>
            </section>

            {/* Asymmetrical Floating Cards Grid */}
            <section className="w-full mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* Card 1: Gesture Trigger */}
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

              {/* Card 2: Voice Guardian */}
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

              {/* Card 3: One-Tap Sanctuary */}
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

            <section className="w-full mt-16 max-w-4xl">
              <AudioTestPanel />
            </section>
            
            <section className="w-full mt-16 max-w-5xl">
              <IncidentDashboard/>
            </section>

            <section className="w-full mt-16 max-w-5xl">
              <GuardianChat />
            </section>

            <section className="w-full mt-24 max-w-4xl glass-panel p-8 rounded-[32px] border border-white/5 relative">
              {/* Inner highlights */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/5 rounded-full blur-2xl" />
              <h2 className="font-serif text-2xl text-white mb-6 flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-neon-orchid" />
                Shield Telemetry & Status
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                
                {/* Tel 1 */}
                <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                  <span className="text-[10px] uppercase tracking-wider text-pink-100/40 block mb-1">
                    GPS Tracking
                  </span>
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="font-sans text-sm font-semibold">Active & Secured</span>
                  </div>
                </div>

                {/* Tel 2 */}
                <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                  <span className="text-[10px] uppercase tracking-wider text-pink-100/40 block mb-1">
                    Trusted Circle
                  </span>
                  <div className="flex items-center gap-2 text-white">
                    <Users className="w-4 h-4 text-pink-300" />
                    <span className="font-sans text-sm font-semibold">4 Contacts Synced</span>
                  </div>
                </div>

                {/* Tel 3 */}
                <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                  <span className="text-[10px] uppercase tracking-wider text-pink-100/40 block mb-1">
                    Security Node
                  </span>
                  <div className="flex items-center gap-2 text-white">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span className="font-sans text-sm font-semibold">256-bit Encrypted</span>
                  </div>
                </div>

                {/* Tel 4 */}
                <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                  <span className="text-[10px] uppercase tracking-wider text-pink-100/40 block mb-1">
                    Battery Load
                  </span>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-3.5 h-3.5 rounded-md border border-emerald-400 flex items-center justify-center p-[2px]">
                      <div className="w-full h-full bg-emerald-400 rounded-sm" />
                    </div>
                    <span className="font-sans text-sm font-semibold">0.4%/hr Passive</span>
                  </div>
                </div>

              </div>
            </section>

          </main>

          {/* Footer Info */}
          <footer className="w-full glass-panel border-t border-white/5 px-6 md:px-12 py-8 mt-24 z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-wider uppercase text-pink-100/40 gap-4">
            <span>Aura Guard © 2026. Made with Absolute Care.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-neon-orchid transition-colors">Privacy Shield</a>
              <a href="#" className="hover:text-neon-orchid transition-colors">Legal dispatch compliance</a>
            </div>
          </footer>
        </div>
      )}

      {/* SOS TRIGGERED FULL-SCREEN GLASS OVERLAY */}
      {sosActive && (
        <SosOverlay 
          sosCountdown={sosCountdown} 
          onCancel={cancelSos} 
        />
      )}
    </>
  );
}

export default App;
