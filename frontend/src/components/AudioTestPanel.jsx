import React, { useState } from 'react';

const AudioTestPanel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isSosTriggered, setIsSosTriggered] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAudioSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSosTriggered(true);

    const formData = new FormData();
    formData.append('audio', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/audio/analyze', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.summary) {
        setSummary(data.summary);
      } else if (data.transcription) {
        setSummary(data.transcription);
      } else {
        setSummary('Audio analyzed successfully, but no transcript summary was returned.');
      }
    } catch (err) {
      console.error('[Audio Test Panel] Fetch failure:', err);
      setSummary('Failed to retrieve analysis from backend server.');
    }
  };

  const handleResetTerminal = (e) => {
    e.stopPropagation();
    setIsSosTriggered(false);
  };

  return (
    <div className="w-full p-6 bg-white/2 border border-neon-orchid/30 rounded-3xl backdrop-blur-xl shadow-[0_0_20px_rgba(217,70,239,0.15)] flex flex-col gap-4 text-left mx-auto">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.2em] text-neon-orchid font-mono mb-1 font-semibold">
          System Verification
        </span>
        <h2 className="font-serif text-xl text-white font-medium">
          Emergency Audio Diagnostics
        </h2>
      </div>

      <form onSubmit={handleAudioSubmit} className="flex flex-col gap-4">
        <div className="p-4 rounded-2xl bg-white/3 border border-white/5 flex flex-col gap-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-pink-100/40">
            Select Test Audio File (.mp3, .wav)
          </label>
          <input 
            type="file" 
            accept=".mp3, .wav" 
            onChange={handleFileChange}
            className="block w-full text-xs text-pink-100/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:tracking-wider file:font-semibold file:bg-neon-orchid/10 file:text-neon-orchid hover:file:bg-neon-orchid/20 file:cursor-pointer transition-colors duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedFile}
          className="w-full py-3 rounded-2xl font-serif font-bold tracking-wider uppercase transition-all duration-300 shadow-lg cursor-pointer text-center bg-neon-orchid text-white hover:scale-102 active:scale-98 disabled:opacity-40 disabled:pointer-events-none"
        >
          🚀 Run Audio & Call Test
        </button>
      </form>

      {summary && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
          <span className="text-[10px] font-mono tracking-wider uppercase text-neon-orchid font-semibold">
            Transcription Summary:
          </span>
          <p className="text-sm font-sans font-light text-white leading-relaxed">
            {summary}
          </p>
        </div>
      )}

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

export default AudioTestPanel;
