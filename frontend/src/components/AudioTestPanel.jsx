import React, { useState } from "react";

const AudioTestPanel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isSosTriggered, setIsSosTriggered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSummary("");
      setIsSosTriggered(false);
    }
  };

  const handleAudioSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("audio", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:3001/api/audio/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("AI Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed.");
      }

      // Summary
      if (data.analysis?.summary) {
        setSummary(data.analysis.summary);
      } else if (data.transcription) {
        setSummary(data.transcription);
      } else {
        setSummary("Audio analyzed successfully.");
      }

      // Trigger popup only if AI says so
      setIsSosTriggered(data.triggerSOS === true);

    } catch (err) {
      console.error(err);

      setSummary(err.message || "Failed to analyze audio.");

      setIsSosTriggered(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResetTerminal = () => {
    setIsSosTriggered(false);
    setSummary("");
    setSelectedFile(null);
  };

  return (
    <div className="w-full p-6 bg-white/2 border border-neon-orchid/30 rounded-3xl backdrop-blur-xl shadow-[0_0_20px_rgba(217,70,239,0.15)] flex flex-col gap-4 text-left mx-auto">

      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neon-orchid font-mono mb-1 font-semibold">
          System Verification
        </span>

        <h2 className="font-serif text-xl text-white font-medium">
          Emergency Audio Diagnostics
        </h2>
      </div>

      <form
        onSubmit={handleAudioSubmit}
        className="flex flex-col gap-4"
      >
        <div className="p-4 rounded-2xl bg-white/3 border border-white/5 flex flex-col gap-2">

          <label className="text-[11px] font-mono uppercase tracking-wider text-pink-100/40">
            Select Test Audio File (.mp3, .wav)
          </label>

          <input
            type="file"
            accept=".mp3,.wav"
            onChange={handleFileChange}
            className="block w-full text-xs text-pink-100/50
            file:mr-4 file:py-2 file:px-4
            file:rounded-xl file:border-0
            file:text-xs
            file:font-mono
            file:tracking-wider
            file:font-semibold
            file:bg-neon-orchid/10
            file:text-neon-orchid
            hover:file:bg-neon-orchid/20
            file:cursor-pointer"
          />

        </div>

        <button
          type="submit"
          disabled={!selectedFile || loading}
          className="w-full py-3 rounded-2xl
          font-serif font-bold tracking-wider uppercase
          transition-all duration-300
          shadow-lg
          bg-neon-orchid text-white
          hover:scale-105
          active:scale-95
          disabled:opacity-40
          disabled:pointer-events-none"
        >
          {loading
            ? "Analyzing..."
            : "🚀 Run Audio & Call Test"}
        </button>

      </form>

      {summary && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">

          <span className="text-[10px] uppercase tracking-wider font-mono text-neon-orchid font-semibold">
            AI Analysis
          </span>

          <p className="text-white mt-2 leading-relaxed">
            {summary}
          </p>

        </div>
      )}

      {isSosTriggered && (
        <div className="fixed inset-0 z-50 bg-red-600 flex flex-col justify-center items-center p-8">

          <div className="max-w-md text-center">

            <span className="text-white font-bold uppercase tracking-[0.25em] animate-pulse">
              🚨 Emergency Alert
            </span>

            <h1 className="mt-6 text-4xl font-serif text-white font-bold">
              SOS Triggered
            </h1>

            <p className="text-white mt-4">
              Guardians have been notified.
            </p>

            <button
              onClick={handleResetTerminal}
              className="mt-8 px-8 py-4 bg-white text-red-600 rounded-2xl font-bold hover:scale-105 transition"
            >
              Reset
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default AudioTestPanel;