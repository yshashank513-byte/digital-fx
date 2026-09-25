"use client";

import { useState } from "react";
import { BusinessProfile } from "@/lib/reviewFlowTypes";

interface DeleteModalProps {
  isOpen: boolean;
  business: BusinessProfile | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteModal({
  isOpen,
  business,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !business) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-2xl font-bold mb-4">
          🗑
        </div>

        <h3 className="text-base font-extrabold text-[#080d24]">
          Delete Business &amp; QR for &quot;{business.name}&quot;?
        </h3>

        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          This action will permanently remove this business and its associated QR configuration from the active management panel.
          Customers scanning this QR code in the future will see an invalid link message.
        </p>

        <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/60 p-3 text-[11px] text-rose-800">
          <strong>Safety Notice:</strong> Historical scan analytics and draft logs will be archived safely.
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
          >
            {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
}
