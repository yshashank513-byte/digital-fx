"use client";

interface BlogPosterProps {
  title: string;
  category: string;
  date: string;
  readingTime?: string;
  className?: string;
}

export default function BlogPoster({
  title,
  category,
  date,
  readingTime = "7 min read",
  className = "",
}: BlogPosterProps) {
  return (
    <div
      className={`relative w-full aspect-[16/9] min-h-[260px] sm:min-h-[340px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#080d24] via-[#0d163d] to-[#040717] text-white p-6 sm:p-10 flex flex-col justify-between border border-slate-800 shadow-2xl ${className}`}
    >
      {/* Background Subtle Tech Grid & Glow Elements */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/30 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/20 blur-[90px] rounded-full pointer-events-none" />

      {/* Top Bar: Digital FX Branding & Category Tag */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Clean Logo without border/box */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img src="/logo.png" alt="Digital FX" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9 object-contain" />
          <div>
            <div className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-none">
              DIGITAL <span className="text-[#207de9]">FX</span>
            </div>
            <div className="text-[8px] sm:text-[9.5px] font-bold uppercase tracking-[1.4px] text-slate-400 mt-0.5">
              Strategy &amp; Insights Desk
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            {category}
          </span>
        </div>
      </div>

      {/* Center Section: Main Blog Title & Subtitle */}
      <div className="relative z-10 my-auto py-4">
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[2px] text-emerald-400 mb-2 flex items-center gap-2">
          <span>DAILY STRATEGY INSIGHT</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-3xl drop-shadow-md">
          {title}
        </h2>
      </div>

      {/* Bottom Footer Watermark & Badges */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-slate-400 text-[10.5px] sm:text-xs font-medium">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-slate-300 font-bold">
            <span className="text-[#207de9]">★</span> Verified Blueprint
          </span>
          <span>•</span>
          <span>{readingTime}</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
          <span>www.digitalfx.in</span>
          <span>|</span>
          <span className="text-slate-300">Revenue-Focused Marketing</span>
        </div>
      </div>
    </div>
  );
}
