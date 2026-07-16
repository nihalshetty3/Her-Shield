import React, { useState, useRef } from "react";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

let encoderRegistered = false;

const registerEncoder = async () => {
  if (!encoderRegistered) {
    await register(await connect());
    encoderRegistered = true;
  }
};

const AudioTestPanel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isSosTriggered, setIsSosTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const locationWatchRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSummary("");
      setIsSosTriggered(false);
    }
  };

  function startLocationTracking() {

    console.log("📍 Location Tracking Started");
  
    if (!navigator.geolocation) {
      console.log("❌ Geolocation not supported");
      return;
    }
  
    locationWatchRef.current = navigator.geolocation.watchPosition(
  
      (position) => {
  
        console.log("✅ GPS RECEIVED");
        console.log(position.coords);
  
        const { latitude, longitude } = position.coords;
  
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
  
        fetch("http://localhost:8000/location/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            latitude,
            longitude
          })
        })
        .then(() => console.log("✅ Location sent to backend"))
        .catch(err => console.error("❌ Error updating location:", err));
  
      },
  
      (err) => {
  
        console.log("❌ GPS ERROR");
        console.log(err);
  
      },
  
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
  
    );
  }

  function stopLocationTracking() {
    if (locationWatchRef.current !== null) {
      navigator.geolocation.clearWatch(locationWatchRef.current);
      locationWatchRef.current = null;
    }
  }

  const startLiveProtection = async () => {
    try {
      setSummary("");
      setIsSosTriggered(false);
      await registerEncoder();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      streamRef.current = stream;
      startLocationTracking();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/wav"
      });
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, {
          type: "audio/wav"
        });
        const file = new File([blob], "recording.wav", {
          type: "audio/wav"
        });
        await uploadAndAnalyze(file);
      };
      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Mic access or registration failed:", err);
      setSummary("Failed to access microphone.");
    }
  };

  const stopLiveProtection = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsListening(false);
    }
  };

  const uploadAndAnalyze = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/voice/detect", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setSummary(
        data.analysis?.summary ||
        data.transcription ||
        "No threat detected."
    );
      if (data.triggerSOS) {
        setIsSosTriggered(true);
      } else {
        setIsSosTriggered(false);
      }
    } catch (err) {
      console.error(err);
      setSummary(err.message || "Failed to analyze audio.");
      setIsSosTriggered(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    await uploadAndAnalyze(selectedFile);
  };

  const handleResetTerminal = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    setIsListening(false);
    setLoading(false);
    setSummary("");
    setSelectedFile(null);
    setIsSosTriggered(false);
    stopLocationTracking();
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-panel glass-panel-glow relative flex flex-col p-8 rounded-3xl select-none transition-all duration-700 w-full max-w-6xl mx-auto my-6 text-center items-center justify-center ${
        isHovered
          ? 'translate-y-[-8px] scale-[1.02] border-white/20 bg-white/5 shadow-[0_20px_50px_rgba(255,240,245,0.08)]'
          : 'border-white/8 hover:translate-y-[-8px]'
      }`}
    >
      <div className={`absolute -top-12 left-1/4 w-1/2 h-20 bg-gradient-to-b from-pink-300/10 via-purple-500/5 to-transparent blur-xl transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-40'}`} />

      <div className="z-10 w-full flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest text-pink-200/50 font-sans font-light mb-2">
          System Verification
        </span>
        <h2 className="text-xl font-serif font-semibold text-white tracking-wide mb-6 transition-colors duration-300">
          Emergency Audio Diagnostics
        </h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full z-10 space-y-4 mb-6">
        <label className="text-[11px] font-mono uppercase tracking-wider text-pink-100/40 block">
          Live Emergency Detection
        </label>

        {!isListening ? (
          <button
            type="button"
            onClick={startLiveProtection}
            className="w-full py-3 bg-[#be185d]/85 text-white border border-[#be185d]/40 font-serif font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-none cursor-pointer relative overflow-hidden group"
          >
            <span className="relative z-10">🎤 Start Live Protection</span>
            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[glint_0.8s_ease-in-out]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={stopLiveProtection}
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-serif font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-none cursor-pointer disabled:opacity-50 relative overflow-hidden group"
          >
            <span className="relative z-10">{loading ? "Analyzing..." : "🛑 Analyze Recording"}</span>
            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[glint_0.8s_ease-in-out]" />
          </button>
        )}
      </div>

      {isListening && (
        <div className="text-green-400 font-semibold animate-pulse mb-4 z-10">
          🎙 Listening...
        </div>
      )}

      <form
        onSubmit={handleAudioSubmit}
        className="w-full flex flex-col gap-4 z-10 mb-6"
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full space-y-4">
          <label className="text-[11px] font-mono uppercase tracking-wider text-pink-100/40 block">
            Select Test Audio File (.mp3, .wav)
          </label>

          <input
            type="file"
            accept=".mp3,.wav"
            disabled={isListening}
            onChange={handleFileChange}
            className="block w-full text-xs text-pink-100/50 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:bg-[#130a24] file:border file:border-[#23153c] file:text-slate-300 hover:file:bg-[#1d0e38] file:transition-all file:cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedFile || loading || isListening}
          className="w-full py-3 bg-[#be185d]/85 text-white border border-[#be185d]/40 font-serif font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none relative overflow-hidden group"
        >
          <span className="relative z-10">{loading ? "Analyzing..." : "🚀 Run Audio & Call Test"}</span>
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[glint_0.8s_ease-in-out]" />
        </button>
      </form>

      {summary && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full z-10 space-y-4 text-left">
          <span className="text-[10px] uppercase tracking-wider font-mono text-neon-orchid font-semibold">
            AI Analysis
          </span>
          <p className="text-white mt-2 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {isSosTriggered && (
        <div className="fixed inset-0 z-50 bg-red-650 flex flex-col justify-center items-center p-8">
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
              className="mt-8 px-8 py-4 bg-white text-red-600 rounded-2xl font-bold hover:scale-105 transition relative overflow-hidden group"
            >
              <span className="relative z-10">Reset</span>
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[glint_0.8s_ease-in-out]" />
            </button>
          </div>
        </div>
      )}

      <div className={`absolute inset-0 rounded-3xl border border-transparent transition-all duration-700 pointer-events-none ${isHovered ? 'bg-gradient-to-r from-neon-orchid/20 via-pink-300/10 to-indigo-500/20 [mask-image:linear-gradient(to_bottom,white,transparent)]' : ''}`} />
    </div>
  );
};

export default AudioTestPanel;