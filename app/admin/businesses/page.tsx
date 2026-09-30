"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminBusinessesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/review-qr");
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#207de9]" />
    </div>
  );
}
