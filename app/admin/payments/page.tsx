"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Payment = {
  id?: string;
  txnid: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  plan_id?: string | null;
  product_name?: string | null;
  amount?: number | string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export default function PaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  // ========================================
  // AUTH + INITIAL LOAD
  // ========================================

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("digitalfx_admin") === "true";

    if (!loggedIn) {
      router.replace("/admin/login");
      return;
    }

    loadPayments();
  }, [router]);

  // ========================================
  // LOAD PAYMENTS
  // ========================================

  async function loadPayments() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/payments",
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const text = await response.text();

      let result: {
        success?: boolean;
        data?: Payment[];
        error?: string;
      };

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          `Payments API returned invalid response (${response.status}).`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to load payments."
        );
      }

      setPayments(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "PAYMENTS LOAD ERROR:",
        err
      );

      setPayments([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load payments."
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // LOGOUT
  // ========================================

  function logout() {
    localStorage.removeItem("digitalfx_admin");
    localStorage.removeItem("digitalfx_remember");

    router.push("/admin/login");
  }

  // ========================================
  // DATE FORMAT
  // ========================================

  function formatDate(
    date?: string | null
  ) {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  // ========================================
  // STATUS CLASS
  // ========================================

  function getStatusClass(
    status?: string | null
  ) {
    const value =
      String(status || "").toLowerCase();

    if (
      value === "success" ||
      value === "paid"
    ) {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (
      value === "failed" ||
      value === "failure"
    ) {
      return "border-red-200 bg-red-50 text-red-600";
    }

    if (value === "pending") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-gray-200 bg-gray-100 text-gray-600";
  }

  // ========================================
  // SEARCH
  // ========================================

  const filteredPayments =
    payments.filter((payment) => {
      const searchText = [
        payment.customer_name,
        payment.customer_email,
        payment.customer_phone,
        payment.product_name,
        payment.plan_id,
        payment.txnid,
        payment.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchText.includes(
        search.toLowerCase()
      );
    });

  // ========================================
  // STATS
  // ========================================

  const successfulPayments =
    payments.filter((payment) => {
      const status =
        String(
          payment.status || ""
        ).toLowerCase();

      return (
        status === "success" ||
        status === "paid"
      );
    });

  const pendingPayments =
    payments.filter((payment) => {
      return (
        String(
          payment.status || ""
        ).toLowerCase() === "pending"
      );
    });

  const failedPayments =
    payments.filter((payment) => {
      const status =
        String(
          payment.status || ""
        ).toLowerCase();

      return (
        status === "failed" ||
        status === "failure"
      );
    });

  const totalRevenue =
    successfulPayments.reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),
      0
    );

  // ========================================
  // ESC CLOSE
  // ========================================

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setSelectedPayment(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#071534]">

      {/* ====================================
          SIDEBAR
      ==================================== */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[252px] flex-col bg-[#071534] text-white lg:flex">

        {/* LOGO */}

        <div className="flex h-[80px] items-center border-b border-white/10 px-5">

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">

              <img
                src="/logo.png"
                alt="Digital FX"
                className="h-10 w-10 object-contain"
              />

            </div>

            <div className="text-left">

              <div className="text-[18px] font-extrabold">
                DIGITAL{" "}
                <span className="text-[#6f8cff]">
                  FX
                </span>
              </div>

              <div className="text-[7px] font-bold tracking-[2px] text-blue-100/40">
                ADMIN PANEL
              </div>

            </div>

          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto p-4">

          <SidebarButton
            label="Dashboard"
            icon="▦"
            onClick={() =>
              router.push("/admin")
            }
          />

          <SidebarButton
            label="Enquiries"
            icon="◎"
            onClick={() =>
              router.push(
                "/admin/enquiries"
              )
            }
          />

          <SidebarButton
            label="Payments"
            icon="₹"
            active
            onClick={() =>
              router.push(
                "/admin/payments"
              )
            }
          />

          <SidebarButton
            label="Services"
            icon="◇"
            onClick={() =>
              router.push(
                "/admin/services"
              )
            }
          />

          <SidebarButton
            label="Projects"
            icon="▣"
          />

          <SidebarButton
            label="Blogs"
            icon="▤"
          />

          <SidebarButton
            label="Testimonials"
            icon="★"
          />

          <SidebarButton
            label="Partners"
            icon="◎"
          />

          <SidebarButton
            label="Team Members"
            icon="◌"
          />

          <SidebarButton
            label="Geo Checker"
            icon="⌖"
            onClick={() =>
              router.push(
                "/admin/geo-checker"
              )
            }
          />

          <SidebarButton
            label="GEO History"
            icon="◷"
            onClick={() =>
              router.push(
                "/admin/geo-checker/history"
              )
            }
          />

          <SidebarButton
            label="Subscribers"
            icon="✉"
          />

          <SidebarButton
            label="Pages"
            icon="▤"
          />

          <SidebarButton
            label="Analytics"
            icon="◒"
          />

          <SidebarButton
            label="Reports"
            icon="▥"
          />

          <SidebarButton
            label="Settings"
            icon="⚙"
          />

        </nav>

        {/* ADMIN USER */}

        <div className="border-t border-white/10 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#315df5] text-sm font-extrabold">
              A
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-bold">
                Admin User
              </p>

              <p className="text-[10px] text-blue-100/40">
                Super Admin
              </p>

            </div>

            <button
              onClick={logout}
              title="Logout"
              className="text-lg text-blue-100/50 transition hover:text-white"
            >
              ↪
            </button>

          </div>

        </div>

      </aside>

      {/* ====================================
          MAIN
      ==================================== */}

      <div className="lg:ml-[252px]">

        {/* HEADER */}

        <header className="flex min-h-[80px] items-center justify-between border-b border-gray-100 bg-white px-5 md:px-8">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-gray-400">
              DIGITAL FX ADMIN
            </p>

            <h1 className="mt-1 text-xl font-extrabold">
              Payments
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={loadPayments}
              disabled={loading}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              {loading
                ? "Loading..."
                : "↻ Refresh"}
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-600">
              A
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <section className="p-5 md:p-8">

          {/* TITLE */}

          <div className="mb-7">

            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-emerald-600">
              PAYMENT MANAGEMENT
            </p>

            <h2 className="mt-2 text-[30px] font-extrabold tracking-[-1px]">
              Payment Transactions
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage and monitor all Digital FX PayU payments.
            </p>

          </div>

          {/* ERROR */}

          {error && (

            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-xs font-extrabold text-red-700">
                  Unable to load payments
                </p>

                <p className="mt-1 text-[10px] text-red-600">
                  {error}
                </p>

              </div>

              <button
                onClick={loadPayments}
                className="rounded-xl bg-red-600 px-4 py-2 text-[10px] font-bold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

            </div>

          )}

          {/* ====================================
              STAT CARDS
          ==================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="TOTAL REVENUE"
              value={`₹${totalRevenue.toLocaleString(
                "en-IN"
              )}`}
              subtitle="Successful payments"
              valueClass="text-emerald-600"
              borderClass="border-emerald-100"
            />

            <StatCard
              title="SUCCESSFUL"
              value={
                successfulPayments.length
              }
              subtitle="Completed transactions"
              valueClass="text-blue-600"
              borderClass="border-blue-100"
            />

            <StatCard
              title="PENDING"
              value={
                pendingPayments.length
              }
              subtitle="Awaiting payment"
              valueClass="text-amber-600"
              borderClass="border-amber-100"
            />

            <StatCard
              title="FAILED"
              value={
                failedPayments.length
              }
              subtitle="Failed transactions"
              valueClass="text-red-500"
              borderClass="border-red-100"
            />

          </div>

          {/* ====================================
              SEARCH
          ==================================== */}

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <h3 className="text-sm font-extrabold">
                  All Payments
                </h3>

                <p className="mt-1 text-[10px] text-gray-400">
                  Click any payment to view full details
                </p>

              </div>

              <div className="relative w-full md:w-[400px]">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search customer, email, package or transaction..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-xs outline-none transition focus:border-blue-400 focus:bg-white"
                />

              </div>

            </div>

          </div>

          {/* ====================================
              PAYMENT TABLE
          ==================================== */}

          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead>

                  <tr className="border-b border-gray-100 bg-gray-50/70 text-left">

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Package
                    </th>

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Transaction ID
                    </th>

                    <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-20 text-center"
                      >

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

                        <p className="mt-4 text-sm font-bold text-gray-400">
                          Loading payments...
                        </p>

                      </td>

                    </tr>

                  ) : filteredPayments.length ===
                    0 ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-20 text-center"
                      >

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-600">
                          ₹
                        </div>

                        <p className="mt-4 text-sm font-extrabold text-gray-400">
                          {search
                            ? "No matching payments"
                            : "No payments found"}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {search
                            ? "Try a different search."
                            : "PayU transactions will appear here."}
                        </p>

                      </td>

                    </tr>

                  ) : (

                    filteredPayments.map(
                      (
                        payment,
                        index
                      ) => (

                        <tr
                          key={
                            payment.id ||
                            payment.txnid ||
                            index
                          }
                          onClick={() =>
                            setSelectedPayment(
                              payment
                            )
                          }
                          className="cursor-pointer border-b border-gray-100 transition hover:bg-blue-50/40"
                        >

                          {/* CUSTOMER */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-extrabold text-blue-700">
                                {(
                                  payment.customer_name ||
                                  "C"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[180px] truncate text-xs font-extrabold">
                                  {payment.customer_name ||
                                    "Customer"}
                                </p>

                                <p className="mt-1 max-w-[220px] truncate text-[9px] text-gray-400">
                                  {payment.customer_email ||
                                    "No email"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* PACKAGE */}

                          <td className="px-5 py-5">

                            <div>

                              <span className="inline-block max-w-[220px] rounded-lg bg-gray-50 px-3 py-2 text-[10px] font-bold text-gray-600">
                                {payment.product_name ||
                                  "Digital FX Service"}
                              </span>

                              {payment.plan_id && (

                                <p className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-gray-400">
                                  {payment.plan_id}
                                </p>

                              )}

                            </div>

                          </td>

                          {/* AMOUNT */}

                          <td className="px-5 py-5">

                            <span className="text-sm font-extrabold">
                              ₹
                              {Number(
                                payment.amount ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">

                            <span
                              className={`inline-flex rounded-full border px-3 py-1.5 text-[8px] font-extrabold uppercase ${getStatusClass(
                                payment.status
                              )}`}
                            >
                              {payment.status ||
                                "Unknown"}
                            </span>

                          </td>

                          {/* TRANSACTION */}

                          <td className="px-5 py-5">

                            <span
                              className="font-mono text-[9px] text-gray-500"
                              title={
                                payment.txnid
                              }
                            >
                              {payment.txnid ||
                                "-"}
                            </span>

                          </td>

                          {/* DATE */}

                          <td className="px-5 py-5">

                            <span className="whitespace-nowrap text-[10px] text-gray-500">
                              {formatDate(
                                payment.created_at
                              )}
                            </span>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* FOOTER */}

          <div className="mt-8 border-t border-gray-200 pt-5 text-[9px] text-gray-400">
            Digital FX Admin • PayU Payment Management
          </div>

        </section>

      </div>

      {/* ====================================
          PAYMENT DETAILS MODAL
      ==================================== */}

      {selectedPayment && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071534]/70 p-4 backdrop-blur-sm"
          onMouseDown={() =>
            setSelectedPayment(null)
          }
        >

          <div
            className="max-h-[92vh] w-full max-w-[680px] overflow-hidden rounded-3xl bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl font-extrabold text-blue-600">
                  ₹
                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-blue-600">
                    PAYMENT DETAILS
                  </p>

                  <h3 className="mt-1 text-lg font-extrabold">
                    Transaction Information
                  </h3>

                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="max-h-[calc(92vh-90px)] overflow-y-auto p-6">

              {/* AMOUNT + STATUS */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-[#071534] p-5 text-white">

                  <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-blue-100/50">
                    Amount
                  </p>

                  <p className="mt-2 text-3xl font-extrabold">
                    ₹
                    {Number(
                      selectedPayment.amount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <p className="mt-1 text-[10px] text-blue-100/50">
                    {selectedPayment.product_name ||
                      "Digital FX Service"}
                  </p>

                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                  <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
                    Payment Status
                  </p>

                  <div className="mt-4">

                    <span
                      className={`inline-flex rounded-full border px-4 py-2 text-[10px] font-extrabold uppercase ${getStatusClass(
                        selectedPayment.status
                      )}`}
                    >
                      {selectedPayment.status ||
                        "Unknown"}
                    </span>

                  </div>

                </div>

              </div>

              {/* CUSTOMER DETAILS */}

              <div className="mt-6">

                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[1.3px] text-gray-400">
                  Customer Information
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                  <DetailItem
                    label="Customer Name"
                    value={
                      selectedPayment.customer_name
                    }
                  />

                  <DetailItem
                    label="Email Address"
                    value={
                      selectedPayment.customer_email
                    }
                  />

                  <DetailItem
                    label="Phone Number"
                    value={
                      selectedPayment.customer_phone
                    }
                  />

                  <DetailItem
                    label="Package / Service"
                    value={
                      selectedPayment.product_name
                    }
                  />

                </div>

              </div>

              {/* TRANSACTION DETAILS */}

              <div className="mt-6">

                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[1.3px] text-gray-400">
                  Transaction Information
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                  <DetailItem
                    label="Transaction ID"
                    value={
                      selectedPayment.txnid
                    }
                    mono
                  />

                  <DetailItem
                    label="Plan ID"
                    value={
                      selectedPayment.plan_id
                    }
                  />

                  <DetailItem
                    label="Payment Amount"
                    value={`₹${Number(
                      selectedPayment.amount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}`}
                  />

                  <DetailItem
                    label="Payment Status"
                    value={
                      selectedPayment.status
                    }
                  />

                  <DetailItem
                    label="Payment Date"
                    value={formatDate(
                      selectedPayment.created_at
                    )}
                  />

                  <DetailItem
                    label="Last Updated"
                    value={formatDate(
                      selectedPayment.updated_at
                    )}
                  />

                </div>

              </div>

              {/* MODAL FOOTER */}

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

                <p className="text-[9px] text-gray-400">
                  Digital FX • PayU Payment Record
                </p>

                <button
                  onClick={() =>
                    setSelectedPayment(null)
                  }
                  className="rounded-xl bg-[#071534] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#10254f]"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

/* ============================================
   SIDEBAR BUTTON
============================================ */

function SidebarButton({
  label,
  icon,
  active = false,
  onClick,
}: {
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
        active
          ? "bg-[#315df5] font-bold text-white shadow-lg shadow-blue-900/20"
          : "text-blue-100/55 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="w-5 text-center">
        {icon}
      </span>

      {label}
    </button>
  );
}

/* ============================================
   STAT CARD
============================================ */

function StatCard({
  title,
  value,
  subtitle,
  valueClass,
  borderClass,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  valueClass: string;
  borderClass: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${borderClass}`}
    >

      <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
        {title}
      </p>

      <p
        className={`mt-3 text-[30px] font-extrabold ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-1 text-[10px] font-semibold text-gray-400">
        {subtitle}
      </p>

    </div>
  );
}

/* ============================================
   DETAIL ITEM
============================================ */

function DetailItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

      <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
        {label}
      </p>

      <p
        className={`mt-2 break-words text-xs font-bold text-[#071534] ${
          mono
            ? "font-mono text-[10px]"
            : ""
        }`}
      >
        {value || "-"}
      </p>

    </div>
  );
}