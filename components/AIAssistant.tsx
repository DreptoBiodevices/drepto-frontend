import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "framer-motion";
import DreptoIcon from "../public/icon.png";

const AIAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "👋 Hi! I’m Drepto AI, your virtual health assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setMessages((p) => [...p, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: userText,
        config: {
          systemInstruction:
            "You are Drepto AI, a friendly medical assistant. Be concise, reassuring, and always suggest consulting a doctor for diagnoses.",
        },
      });

      setMessages((p) => [...p, { role: "model", text: res.text || "Please try again." }]);
    } catch {
      setMessages((p) => [...p, { role: "model", text: "⚠️ Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="w-96 h-[32rem] bg-white rounded-3xl shadow-2xl border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold tracking-wide">
                <img src={DreptoIcon} alt="Drepto" className="w-6 h-6" />
                Drepto AI
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white opacity-80 hover:opacity-100 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-teal-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm max-w-[80%] leading-relaxed ${m.role === "user"
                      ? "bg-teal-600 text-white rounded-br-none"
                      : "bg-white text-gray-700 border rounded-bl-none"
                      }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-xs text-teal-500 animate-pulse">Drepto AI is typing…</div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask a health question…"
                className="flex-1 px-4 py-2 rounded-full border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-full shadow"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="mt-4 w-14 h-14 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 shadow-xl flex items-center justify-center hover:scale-110 transition"
      >
        <img src={DreptoIcon} alt="Drepto AI" className="w-7 h-7" />
      </button>
    </div>
  );
};

export default AIAssistant;
