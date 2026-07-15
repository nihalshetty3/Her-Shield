import React, { useState, useRef, useEffect } from "react";

export default function GuardianChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "🛡 Hello Guardian.\n\nI'm monitoring the current emergency.\n\nAsk me anything about the incident."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatHovered, setIsChatHovered] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function askQuestion(question) {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      text: question
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch(
        "http://localhost:8000/guardian/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question
          })
        }
      );
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.answer
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Unable to contact AI Guardian."
        }
      ]);
    }
    setLoading(false);
  }

  return (
    <div
      onMouseEnter={() => setIsChatHovered(true)}
      onMouseLeave={() => setIsChatHovered(false)}
      className={`glass-panel glass-panel-glow relative flex flex-col p-8 rounded-3xl select-none transition-all duration-700 w-full h-[720px] ${
        isChatHovered
          ? 'translate-y-[-8px] scale-[1.02] border-white/20 bg-white/5 shadow-[0_20px_50px_rgba(255,240,245,0.08)]'
          : 'border-white/8 hover:translate-y-[-8px]'
      }`}
    >
      <div className={`absolute -top-12 left-1/4 w-1/2 h-20 bg-gradient-to-b from-pink-300/10 via-purple-500/5 to-transparent blur-xl transition-opacity duration-700 ${isChatHovered ? 'opacity-100' : 'opacity-40'}`} />

      <div className="z-10 flex flex-col w-full h-full justify-between">
        <div className="mb-4">
          <h2 className="text-xl font-serif font-semibold text-white tracking-wide mb-4 transition-colors duration-300">
            AI Guardian Assistant
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Ask anything about the current emergency.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => askQuestion("What happened?")}
              className="bg-[#160b29] border border-[#23153c] text-slate-300 hover:bg-[#1d0e38] hover:border-[#381e5c] transition-all px-3 py-2 rounded-full cursor-pointer text-xs font-semibold"
            >
              What happened?
            </button>

            <button
              onClick={() => askQuestion("Should I call the police?")}
              className="bg-[#160b29] border border-[#23153c] text-slate-300 hover:bg-[#1d0e38] hover:border-[#381e5c] transition-all px-3 py-2 rounded-full cursor-pointer text-xs font-semibold"
            >
              Call Police
            </button>

            <button
              onClick={() => askQuestion("Was screaming detected?")}
              className="bg-[#160b29] border border-[#23153c] text-slate-300 hover:bg-[#1d0e38] hover:border-[#381e5c] transition-all px-3 py-2 rounded-full cursor-pointer text-xs font-semibold"
            >
              Scream?
            </button>

            <button
              onClick={() => askQuestion("Summarize the incident")}
              className="bg-[#160b29] border border-[#23153c] text-slate-300 hover:bg-[#1d0e38] hover:border-[#381e5c] transition-all px-3 py-2 rounded-full cursor-pointer text-xs font-semibold"
            >
              Summary
            </button>
          </div>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto bg-[#04010a] border border-[#130a24] rounded-xl p-5 space-y-5 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 whitespace-pre-wrap shadow-lg ${msg.role === "user"
                    ? "bg-[#1d0e38] border border-[#381e5c] text-white"
                    : "bg-[#04010a] border border-[#130a24] text-white"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#04010a] border border-[#130a24] rounded-2xl px-5 py-4 animate-pulse text-zinc-400">
                🤖 AI Guardian is typing...
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-850 pt-4 flex gap-3 w-full">
          <input
            className="flex-1 bg-[#04010a] border border-[#130a24] rounded-xl px-4 py-3 outline-none text-white text-sm placeholder-slate-500"
            placeholder="Ask AI Guardian..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askQuestion(input);
              }
            }}
          />

          <button
            onClick={() => askQuestion(input)}
            className="px-6 bg-[#160b29] border border-[#23153c] text-slate-300 hover:bg-[#1d0e38] hover:border-[#381e5c] transition-all rounded-xl cursor-pointer font-semibold text-sm"
          >
            Send
          </button>
        </div>
      </div>

      <div className={`absolute inset-0 rounded-3xl border border-transparent transition-all duration-700 pointer-events-none ${isChatHovered ? 'bg-gradient-to-r from-neon-orchid/20 via-pink-300/10 to-indigo-500/20 [mask-image:linear-gradient(to_bottom,white,transparent)]' : ''}`} />
    </div>
  );
}