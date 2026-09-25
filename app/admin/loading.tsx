export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9]" />
        <p className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
          Loading Admin Module...
        </p>
      </div>
    </div>
  );
}
