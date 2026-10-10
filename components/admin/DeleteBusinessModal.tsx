"use client";

import { useState } from "react";
import { BusinessProfile } from "@/lib/reviewFlowTypes";

interface DeleteBusinessModalProps {
  isOpen: boolean;
  business: BusinessProfile | null;
  onClose: () => void;
  onConfirm: (business: BusinessProfile) => Promise<void>;
}

export default function DeleteBusinessModal({
  isOpen,
  business,
  onClose,
  onConfirm,
}: DeleteBusinessModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !business) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await onConfirm(business);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete business. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Warning Icon Header */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-2xl font-bold mb-4 border border-rose-100">
          🗑️
        </div>

        <h3 className="text-base font-extrabold text-[#080d24]">
          Delete &quot;{business.name}&quot;?
        </h3>

        <div className="mt-3 space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            Are you sure you want to delete this business? This action will permanently remove:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-500 font-medium">
            <li>The business profile and branding configuration</li>
            <li>Its associated dynamic ReviewFlow QR code (<code>/r/{business.qrId || business.id}</code>)</li>
            <li>Customer review session records and draft history</li>
          </ul>
          <p className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800 font-medium">
            ⚠️ <strong>Warning:</strong> Any physical counter standees or printed QR codes already deployed will no longer lead to an active review desk.
          </p>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700 font-semibold">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-extrabold text-white shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <span>🗑️</span>
                <span>Delete Business</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
