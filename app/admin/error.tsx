"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ADMIN PANEL ERROR CAUGHT BY BOUNDARY:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-2xl font-black border border-amber-200">
          ⚠
        </div>

        <div>
          <h1 className="text-lg font-black text-[#080d24]">Admin Console Recovery</h1>
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            An unexpected error occurred while rendering the admin console. Your administrative data remains safe.
          </p>
        </div>

        {error?.message && (
          <div className="rounded-xl bg-slate-50 p-3 text-left font-mono text-[11px] text-slate-700 border border-slate-200 overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => reset()}
            className="w-full rounded-xl bg-[#207de9] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1866c2] transition cursor-pointer"
          >
            ↻ Try Again
          </button>

          <Link
            href="/admin/login"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            ← Return to Admin Login
          </Link>

          <Link
            href="/"
            className="w-full text-center text-xs font-semibold text-slate-500 hover:text-[#080d24] transition pt-1"
          >
            Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
