"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PaymentFailureContent() {
  const searchParams = useSearchParams();

  const txnid = searchParams.get("txnid") || "";

  const reason =
    searchParams.get("reason") ||
    "Payment was not completed.";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(7,21,52,0.12)",
        }}
      >
        {/* FAILURE ICON */}
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto",
            borderRadius: "50%",
            background: "#fff1f2",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "42px",
            fontWeight: "800",
          }}
        >
          ×
        </div>

        {/* TITLE */}
        <p
          style={{
            marginTop: "24px",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "2px",
            color: "#ef4444",
          }}
        >
          PAYMENT FAILED
        </p>

        <h1
          style={{
            marginTop: "8px",
            fontSize: "30px",
            fontWeight: "800",
            color: "#071534",
          }}
        >
          Payment Unsuccessful
        </h1>

        <p
          style={{
            marginTop: "12px",
            color: "#64748b",
            lineHeight: "1.6",
          }}
        >
          We could not complete your payment.
          Please try again.
        </p>

        {/* TRANSACTION DETAILS */}
        <div
          style={{
            marginTop: "28px",
            padding: "18px",
            borderRadius: "16px",
            background: "#f8fafc",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#94a3b8",
            }}
          >
            TRANSACTION ID
          </p>

          <p
            style={{
              marginTop: "6px",
              fontSize: "12px",
              fontWeight: "700",
              wordBreak: "break-all",
              color: "#071534",
            }}
          >
            {txnid || "-"}
          </p>

          <p
            style={{
              marginTop: "18px",
              fontSize: "11px",
              fontWeight: "800",
              color: "#94a3b8",
            }}
          >
            REASON
          </p>

          <p
            style={{
              marginTop: "6px",
              fontSize: "12px",
              lineHeight: "1.6",
              color: "#475569",
            }}
          >
            {reason}
          </p>
        </div>

        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            width: "100%",
            marginTop: "28px",
            height: "48px",
            border: "none",
            borderRadius: "12px",
            background: "linear-gradient(90deg,#315df5,#6047ed)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          Back to Digital FX
        </button>

        {/* FOOTER */}
        <p
          style={{
            marginTop: "22px",
            fontSize: "10px",
            color: "#94a3b8",
          }}
        >
          Digital FX • Secure Payment Processing
        </p>
      </div>
    </main>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f7fb",
            padding: "24px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(7,21,52,0.12)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                margin: "0 auto",
                borderRadius: "50%",
                border: "4px solid #e5e7eb",
                borderTopColor: "#315df5",
                animation: "spin 1s linear infinite",
              }}
            />

            <p
              style={{
                marginTop: "18px",
                fontSize: "13px",
                fontWeight: "700",
                color: "#64748b",
              }}
            >
              Processing payment...
            </p>
          </div>
        </main>
      }
    >
      <PaymentFailureContent />
    </Suspense>
  );
}