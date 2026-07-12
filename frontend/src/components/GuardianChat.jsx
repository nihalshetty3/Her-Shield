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

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
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

        }
        catch {

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

        <div className="w-full h-[720px] bg-zinc-900 rounded-2xl shadow-2xl flex flex-col border border-zinc-800">

            {/* Header */}

            <div className="p-5 border-b border-zinc-800">

                <h2 className="text-2xl font-bold text-white">
                    🛡 AI Guardian Assistant
                </h2>

                <p className="text-zinc-400 text-sm mt-2">
                    Ask anything about the current emergency.
                </p>

                <div className="flex flex-wrap gap-2 mt-4">

                    <button
                        onClick={() => askQuestion("What happened?")}
                        className="px-3 py-2 rounded-full bg-zinc-800 hover:bg-pink-600 transition"
                    >
                        What happened?
                    </button>

                    <button
                        onClick={() => askQuestion("Should I call the police?")}
                        className="px-3 py-2 rounded-full bg-zinc-800 hover:bg-pink-600 transition"
                    >
                        Call Police
                    </button>

                    <button
                        onClick={() => askQuestion("Was screaming detected?")}
                        className="px-3 py-2 rounded-full bg-zinc-800 hover:bg-pink-600 transition"
                    >
                        Scream?
                    </button>

                    <button
                        onClick={() => askQuestion("Summarize the incident")}
                        className="px-3 py-2 rounded-full bg-zinc-800 hover:bg-pink-600 transition"
                    >
                        Summary
                    </button>

                    <button
                        onClick={() => askQuestion("What is the current risk level?")}
                        className="px-3 py-2 rounded-full bg-zinc-800 hover:bg-pink-600 transition"
                    >
                        Risk
                    </button>

                </div>

            </div>

            {/* Messages */}

            <div className="flex-1 overflow-y-auto p-5 space-y-5">

                {messages.map((msg, index) => (

                    <div
                        key={index}
                        className={`flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >

                        <div
                            className={`max-w-[75%] rounded-2xl px-5 py-4 whitespace-pre-wrap shadow-lg ${
                                msg.role === "user"
                                    ? "bg-pink-600 text-white"
                                    : "bg-zinc-800 text-white"
                            }`}
                        >

                            {msg.text}

                        </div>

                    </div>

                ))}

                {loading && (

                    <div className="flex justify-start">

                        <div className="bg-zinc-800 rounded-2xl px-5 py-4 animate-pulse">

                            🤖 AI Guardian is typing...

                        </div>

                    </div>

                )}

                <div ref={messagesEndRef}></div>

            </div>

            {/* Input */}

            <div className="border-t border-zinc-800 p-4 flex gap-3">

                <input

                    className="flex-1 bg-zinc-800 rounded-xl px-4 py-3 outline-none text-white"

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

                    className="px-6 bg-pink-600 rounded-xl hover:bg-pink-700 transition"

                >

                    Send

                </button>

            </div>

        </div>

    );

}