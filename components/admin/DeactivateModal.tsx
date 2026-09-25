"use client";

import { useState } from "react";
import { BusinessProfile } from "@/lib/reviewFlowTypes";

interface DeactivateModalProps {
  isOpen: boolean;
  business: BusinessProfile | null;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function DeactivateModal({
  isOpen,
  business,
  onClose,
  onConfirm,
}: DeactivateModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !business) return null;

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await onConfirm(reason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-2xl font-bold mb-4">
          ⏸
        </div>

        <h3 className="text-base font-extrabold text-[#080d24]">
          Deactivate QR Code for &quot;{business.name}&quot;?
        </h3>

        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          This QR will no longer be accessible to customers until it is activated again.
          Existing printed QR codes and standees do <strong>not</strong> need to be regenerated;
          customers will simply see a friendly &quot;Review Desk Temporarily Inactive&quot; screen.
        </p>

        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Reason for deactivation (Optional)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Renovation, store relocated, paused by owner"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#207de9]"
          />
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
            onClick={handleDeactivate}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-amber-700 transition cursor-pointer disabled:opacity-50"
          >
            {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            <span>Deactivate QR</span>
          </button>
        </div>
      </div>
    </div>
  );
}
