import React from 'react';
import { User, Phone, CheckCircle2, Shield, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const ProfilePage = ({
  onBack,
  user = {
    username: "User Identity",
    role: "Security Node",
    status: "Active",
    securityLevel: "Premium Shield",
    routingType: "Dual-Path Active"
  },
  guardianLines = [
    { label: "Guardian Line 1", number: "Not Configured" },
    { label: "Guardian Line 2", number: "Not Configured" }
  ],
  systemStatus = {
    title: "Twilio Matrix Status",
    label: "Armed & Online",
    badge: "Ready",
    isOnline: true
  }
}) => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans overflow-hidden flex flex-col">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-purple-900/20 via-pink-900/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent blur-[120px] pointer-events-none" />

      <Navbar
        onBellClick={() => console.log('Bell Clicked')}
        onSettingsClick={() => { }}
        onBrandClick={onBack}
      />

      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 py-10 z-10 flex-1">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/10 text-pink-100/80 cursor-pointer text-sm font-medium w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="font-serif text-3xl md:text-4xl text-white tracking-wide mb-8">
          User Profile & Safety Hub
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-8 rounded-[32px] border border-white/5 relative flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2">{user.username}</h2>
            <p className="text-pink-100/60 font-light mb-6">{user.role}</p>

            <div className="w-full border-t border-white/5 my-4" />

            <div className="w-full space-y-4 text-left">
              <div className="flex justify-between items-center py-2">
                <span className="text-pink-100/40 text-sm">Account Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {user.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-pink-100/40 text-sm">Security Level</span>
                <span className="text-white text-sm font-semibold">{user.securityLevel}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-pink-100/40 text-sm">Twilio Routing</span>
                <span className="text-white text-sm font-semibold">{user.routingType}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px] border border-white/5 relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                Emergency Handlers
              </h3>

              <div className="space-y-4 mb-6">
                {guardianLines.map((line, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{line.label}</p>
                        <p className="text-xs text-pink-100/40">{line.number}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold bg-white/5 border px-2 py-0.5 rounded-md ${line.number && line.number !== 'Not Configured'
                        ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                        : 'text-pink-100/30 border-white/5'
                      }`}>
                      {line.number && line.number !== 'Not Configured' ? 'Linked' : 'Empty'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white/2 border border-white/5 rounded-2xl">
              <span className="text-[10px] uppercase tracking-wider text-pink-100/40 block mb-3">
                {systemStatus.title}
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${systemStatus.isOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <span className="text-sm text-white font-medium">{systemStatus.label}</span>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${systemStatus.isOnline
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/25'
                  }`}>
                  {systemStatus.badge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full glass-panel border-t border-white/5 px-6 md:px-12 py-8 mt-24 z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-wider uppercase text-pink-100/40 gap-4">
        <span>Aura Guard © 2026. Made with Absolute Care.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-neon-orchid transition-colors">Privacy Shield</a>
          <a href="#" className="hover:text-neon-orchid transition-colors">Legal dispatch compliance</a>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;