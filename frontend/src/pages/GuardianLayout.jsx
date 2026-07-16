import React from 'react';
import Navbar from '../components/Navbar';
import IncidentDashboard from '../components/IncidentDashboard';
import GuardianMap from '../components/GuardianMap';
import GuardianChat from '../components/GuardianChat';
import { useNavigate } from 'react-router-dom';

export default function GuardianLayout() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const scrollContainer = document.querySelector('.overflow-y-auto') || window;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-midnight m-0 p-0 overflow-y-auto overflow-x-hidden relative font-sans text-blush/90 selection:bg-neon-orchid selection:text-white">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-purple-900/20 via-pink-900/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent blur-[120px] pointer-events-none" />

      <Navbar
        onBellClick={() => console.log('Bell Clicked')}
        onSettingsClick={() => navigate('/profile')}
        onBrandClick={() => navigate('/')}
      />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col items-center justify-center text-center space-y-6 z-10">
        <div className="w-full">
          <IncidentDashboard />
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center justify-center items-start text-center mx-auto">
          <GuardianMap />
          <GuardianChat />
        </div>
      </main>

      <footer className="w-full mt-auto border-t border-slate-800/40 bg-[#0c0517]/90 py-4 px-6 mb-0 pb-4 flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-wider uppercase text-pink-100/40 gap-4">
        <span>Aura Guard © 2026. Made with Absolute Care.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-neon-orchid transition-colors">Privacy Shield</a>
          <a href="#" className="hover:text-neon-orchid transition-colors">Legal dispatch compliance</a>
        </div>
      </footer>
    </div>
  );
}
