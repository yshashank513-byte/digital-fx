"use client";

import { useState, useEffect } from "react";

export default function WhatsAppFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Quick action templates grounded in real client inquiries
  const quickPrompts = [
    "📍 Need Local SEO & Google Maps 3-Pack in my city",
    "📈 Want high-ROI Google & Meta Ads campaigns",
    "⚡ Quote for sub-second Next.js website development",
    "📊 Request a Free Growth Audit & Strategy Proposal",
  ];

  // Auto-prompt subtly after 7 seconds if user hasn't dismissed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasDismissed && !hasInteracted) {
        // Leave widget visible, show pulsing notification dot
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, [hasDismissed, hasInteracted]);

  const handleSend = (textToSend?: string) => {
    const message = (textToSend || customMsg).trim();
    const finalMsg = message || "Hi Digital FX, I want to discuss a digital marketing strategy for my business.";
    const url = `https://wa.me/918447583685?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setHasInteracted(true);
  };

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-[95] font-sans antialiased">
      {/* 1. Floating WhatsApp Trigger Button */}
      {!isOpen && (
        <div className="relative group">
          {/* Subtle Attention Callout Bubble on desktop */}
          {!hasDismissed && (
            <div className="hidden md:flex items-center gap-2 absolute left-16 top-1/2 -translate-y-1/2 bg-white text-slate-800 text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-lg border border-slate-200 whitespace-nowrap animate-fadeIn pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Chat with Growth Desk (Online)</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setHasInteracted(true);
            }}
            aria-label="Open WhatsApp Chat with Digital FX Strategist"
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.5)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Pulsing Ripple Effect */}
            <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

            {/* Official WhatsApp Vector Icon */}
            <svg className="w-7 h-7 fill-current relative z-10" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c4.55 0 8.25 3.7 8.25 8.24 0 2.2-.86 4.28-2.42 5.83-1.56 1.56-3.63 2.42-5.83 2.42-1.48 0-2.93-.39-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 01-1.25-4.39c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
            </svg>

            {/* Unread Message Notification Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs">
              1
            </span>
          </button>
        </div>
      )}

      {/* 2. Interactive WhatsApp Chat Modal */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[360px] rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
          {/* WhatsApp Brand Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden">
                  <img src="/logo.png" alt="Digital FX" className="w-full h-full object-contain" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Digital FX Growth Desk</h4>
                <p className="text-[11px] text-emerald-200 font-medium mt-0.5">
                  Replies typically in &lt; 5 mins
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setHasDismissed(true);
              }}
              className="w-8 h-8 rounded-full hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Close WhatsApp chat"
            >
              ✕
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#EFEAE2] space-y-3 max-h-[320px] overflow-y-auto">
            {/* Incoming Message Bubble */}
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-none shadow-xs text-xs leading-relaxed">
                <p className="font-semibold text-[#075E54] mb-1">Shashank Yadav • Senior Strategist</p>
                <p>
                  Namaste! 👋 Welcome to <strong>Digital FX</strong>.
                </p>
                <p className="mt-1">
                  Looking to rank #1 on Google Maps in your city or scale qualified customer inquiries? Tap an option below or type your requirement:
                </p>
                <span className="block text-[9px] text-slate-400 text-right mt-1.5">
                  Just now ✓✓
                </span>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                Quick Inquiries:
              </p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 text-xs font-medium transition flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <span className="text-emerald-500 group-hover:translate-x-0.5 transition font-bold text-xs ml-1 shrink-0">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your business requirement..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#25D366] focus:bg-white transition"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              aria-label="Send WhatsApp message"
              className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition cursor-pointer shadow-xs shrink-0"
            >
              <svg className="w-4 h-4 rotate-90 fill-current" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
