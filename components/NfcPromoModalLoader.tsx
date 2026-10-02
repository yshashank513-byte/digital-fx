"use client";

import dynamic from "next/dynamic";

// Client component wrapper that lazy-loads NfcPromoModal.
// ssr:false is allowed here because this is a "use client" component.
// This keeps NfcPromoModal out of the server HTML and off the critical render path,
// eliminating CLS and reducing the initial JS bundle.
const NfcPromoModal = dynamic(() => import("@/components/NfcPromoModal"), {
  ssr: false,
});

export default function NfcPromoModalLoader() {
  return <NfcPromoModal />;
}
