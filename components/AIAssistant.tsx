import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot } from "lucide-react";

const AIAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Hi, I'm Drepto AI — your virtual health assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages(p => [...p, { role: "user", text }]);
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: text,
        config: {
          systemInstruction:
            "You are Drepto AI, a friendly medical assistant. Be concise, reassuring, and always suggest consulting a doctor for diagnoses.",
        },
      });
      setMessages(p => [...p, { role: "model", text: res.text || "Please try again." }]);
    } catch {
      setMessages(p => [...p, { role: "model", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-[360px] bg-white border border-gray-200 flex flex-col overflow-hidden shadow-xl"
            style={{ borderRadius: '0.5rem', height: '480px' }}
          >
            {/* header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 bg-primary flex items-center justify-center flex-shrink-0"
                  style={{ borderRadius: '0.25rem' }}
                >
                  <Bot size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-none">Drepto AI</p>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mt-0.5">
                    Health Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "model" && (
                    <div
                      className="w-6 h-6 bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 mr-2"
                      style={{ borderRadius: '0.125rem' }}
                    >
                      <Bot size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`px-3.5 py-2.5 text-sm leading-relaxed max-w-[75%] ${
                      m.role === "user"
                        ? "bg-gray-900 text-white"
                        : "bg-white border border-gray-100 text-gray-700"
                    }`}
                    style={{ borderRadius: '0.25rem' }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary flex items-center justify-center" style={{ borderRadius: '0.125rem' }}>
                    <Bot size={12} className="text-white" />
                  </div>
                  <div className="flex gap-1 px-3 py-2.5 bg-white border border-gray-100" style={{ borderRadius: '0.25rem' }}>
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
                placeholder="Ask a health question…"
                className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-primary transition-colors"
                style={{ borderRadius: '0.25rem' }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-9 h-9 flex items-center justify-center bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                style={{ borderRadius: '0.25rem' }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-12 h-12 bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
        style={{ borderRadius: '0.25rem' }}
        aria-label="Open Drepto AI"
      >
        {open ? <X size={18} /> : <Bot size={18} />}
      </button>
    </div>
  );
};

export default AIAssistant;