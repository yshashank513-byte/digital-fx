"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Enquiry = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string | null;
  status: string;
  created_at: string;
};

const statuses = [
  "All",
  "New",
  "Contacted",
  "In Progress",
  "Converted",
  "Closed",
];

export default function EnquiriesPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("digitalfx_admin") === "true";

    if (!loggedIn) {
      router.replace("/admin/login");
      return;
    }

    loadEnquiries();
  }, [router]);

  async function loadEnquiries() {
    setLoading(true);

    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Enquiries error:", error);
      setEnquiries([]);
    } else {
      setEnquiries((data || []) as Enquiry[]);
    }

    setLoading(false);
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    const { error } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Status update error:", error);
      alert("Unable to update status.");
      return;
    }

    setEnquiries((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    );

    setSelected((item) =>
      item && item.id === id
        ? { ...item, status }
        : item
    );
  }

  function logout() {
    localStorage.removeItem("digitalfx_admin");
    localStorage.removeItem("digitalfx_remember");
    router.push("/admin/login");
  }

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.service?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, search, statusFilter]);

  const newCount = enquiries.filter(
    (item) => item.status === "New"
  ).length;

  const contactedCount = enquiries.filter(
    (item) => item.status === "Contacted"
  ).length;

  const progressCount = enquiries.filter(
    (item) => item.status === "In Progress"
  ).length;

  const convertedCount = enquiries.filter(
    (item) => item.status === "Converted"
  ).length;

  const closedCount = enquiries.filter(
    (item) => item.status === "Closed"
  ).length;

  function formatDate(date: string) {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function initials(name: string) {
    const value = name?.trim();

    if (!value) return "C";

    const parts = value.split(" ");

    if (parts.length > 1) {
      return (
        parts[0][0] +
        parts[parts.length - 1][0]
      ).toUpperCase();
    }

    return value[0].toUpperCase();
  }

  function statusClass(status: string) {
    if (status === "New") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    if (status === "Contacted") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    if (status === "In Progress") {
      return "bg-violet-50 text-violet-700 border-violet-100";
    }

    if (status === "Converted") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (status === "Closed") {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }

    return "bg-gray-50 text-gray-600 border-gray-100";
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#071534]">

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <div className="flex h-[70px] items-center justify-between border-b border-gray-100 bg-white px-4 lg:hidden">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <img
              src="/logo.png"
              alt="Digital FX"
              className="h-9 w-9 object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-extrabold">
              DIGITAL{" "}
              <span className="text-[#315df5]">
                FX
              </span>
            </p>

            <p className="text-[8px] font-bold tracking-[1.5px] text-gray-400">
              ADMIN PANEL
            </p>
          </div>

        </div>

        <button
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-lg"
        >
          ☰
        </button>

      </div>


      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mobileMenu && (
        <div className="fixed inset-0 z-[70] bg-[#071534]/30 lg:hidden">

          <div className="absolute left-0 top-0 h-full w-[290px] bg-[#071534] p-5 text-white">

            <div className="mb-8 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                  <img
                    src="/logo.png"
                    alt="Digital FX"
                    className="h-9 w-9 object-contain"
                  />
                </div>

                <p className="font-extrabold">
                  DIGITAL{" "}
                  <span className="text-[#6f8cff]">
                    FX
                  </span>
                </p>

              </div>

              <button
                onClick={() =>
                  setMobileMenu(false)
                }
                className="text-xl text-white/60"
              >
                ×
              </button>

            </div>


            <button
              onClick={() => {
                setMobileMenu(false);
                router.push("/admin");
              }}
              className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              ▦ Dashboard
            </button>


            <button
              onClick={() =>
                setMobileMenu(false)
              }
              className="mb-2 flex w-full items-center gap-3 rounded-xl bg-[#315df5] px-4 py-3 text-sm font-bold text-white"
            >
              ◉ Enquiries
            </button>


            <button
              className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              ◇ Services
            </button>


            <button
              className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              ▣ Projects
            </button>


            <button
              className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              ◒ Analytics
            </button>


            {/* GEO CHECKER */}

            <button
              onClick={() => {
                setMobileMenu(false);
                router.push(
                  "/admin/geo-checker"
                );
              }}
              className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              ⌖ Geo Checker
            </button>


            <button
              onClick={logout}
              className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
            >
              ↪ Logout
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside className="fixed left-0 top-0 hidden h-screen w-[260px] flex-col bg-[#071534] text-white lg:flex">

        <div className="flex h-[82px] items-center border-b border-white/10 px-5">

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">
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

              <div className="mt-0.5 text-[7px] font-bold tracking-[2px] text-blue-100/40">
                ADMIN PANEL
              </div>

            </div>

          </button>

        </div>


        <nav className="flex-1 overflow-y-auto p-4">

          {/* DASHBOARD */}

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center">
              ▦
            </span>

            Dashboard
          </button>


          {/* ENQUIRIES ACTIVE */}

          <button
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl bg-[#315df5] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(49,93,245,.2)]"
          >

            <span className="w-5 text-center">
              ◉
            </span>

            Enquiries

            {newCount > 0 && (
              <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[9px]">
                {newCount}
              </span>
            )}

          </button>


          {/* OTHER ITEMS */}

          {[
            ["◇", "Services"],
            ["▣", "Projects"],
            ["▤", "Blogs"],
            ["★", "Testimonials"],
            ["◎", "Partners"],
            ["◌", "Team Members"],
          ].map(([icon, label]) => (
            <button
              key={label}
              className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
            >
              <span className="w-5 text-center">
                {icon}
              </span>

              {label}
            </button>
          ))}


          {/* GEO CHECKER */}

          <button
            onClick={() =>
              router.push(
                "/admin/geo-checker"
              )
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center">
              ⌖
            </span>

            Geo Checker
          </button>


          {/* REMAINING */}

          {[
            ["✉", "Subscribers"],
            ["▤", "Pages"],
            ["◒", "Analytics"],
            ["▥", "Reports"],
            ["⚙", "Settings"],
          ].map(([icon, label]) => (
            <button
              key={label}
              className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
            >
              <span className="w-5 text-center">
                {icon}
              </span>

              {label}
            </button>
          ))}

        </nav>


        {/* ADMIN */}

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
              className="text-lg text-white/40 hover:text-white"
            >
              ↪
            </button>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="lg:ml-[260px]">

        {/* HEADER */}

        <header className="flex min-h-[82px] items-center justify-between border-b border-gray-100 bg-white px-5 md:px-8">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[1.6px] text-[#315df5]">
              CUSTOMER MANAGEMENT
            </p>

            <h1 className="mt-1 text-xl font-extrabold md:text-2xl">
              Enquiries
            </h1>

          </div>


          <div className="flex items-center gap-3">

            <button
              onClick={loadEnquiries}
              className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-bold text-gray-600 hover:bg-gray-50"
            >
              ↻
              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-600">
              A
            </div>

          </div>

        </header>


        {/* CONTENT */}

        <section className="p-5 md:p-8">

          {/* TITLE */}

          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <h2 className="text-[28px] font-extrabold tracking-[-.8px]">
                Customer Enquiries
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Manage and track every enquiry received
                from your website.
              </p>

            </div>

            <div className="text-xs font-bold text-gray-400">
              {filteredEnquiries.length} of{" "}
              {enquiries.length} enquiries
            </div>

          </div>


          {/* =====================================================
              STAT CARDS
          ====================================================== */}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">

            {[
              [
                "All Enquiries",
                enquiries.length,
                "blue",
              ],
              [
                "New",
                newCount,
                "blue",
              ],
              [
                "Contacted",
                contactedCount,
                "amber",
              ],
              [
                "In Progress",
                progressCount,
                "violet",
              ],
              [
                "Converted",
                convertedCount,
                "green",
              ],
            ].map(
              ([label, count, color]) => {

                const active =
                  (label ===
                    "All Enquiries" &&
                    statusFilter === "All") ||
                  statusFilter === label;

                const styles =
                  color === "amber"
                    ? "bg-amber-50 text-amber-600"
                    : color === "violet"
                    ? "bg-violet-50 text-violet-600"
                    : color === "green"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-blue-50 text-blue-600";

                return (
                  <button
                    key={label}
                    onClick={() =>
                      setStatusFilter(
                        label ===
                          "All Enquiries"
                          ? "All"
                          : String(label)
                      )
                    }
                    className={`rounded-2xl border bg-white p-4 text-left shadow-[0_3px_16px_rgba(16,24,40,.035)] transition ${
                      active
                        ? "border-[#315df5] ring-2 ring-blue-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                        {label}
                      </p>

                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles}`}
                      >
                        {label ===
                        "Converted"
                          ? "✓"
                          : "•"}
                      </div>

                    </div>

                    <p className="mt-3 text-2xl font-extrabold">
                      {count}
                    </p>

                  </button>
                );
              }
            )}

          </div>


          {/* =====================================================
              SEARCH / FILTER
          ====================================================== */}

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_3px_16px_rgba(16,24,40,.035)]">

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search customer, phone, email, service..."
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-gray-400 focus:border-[#315df5] focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

              </div>


              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 outline-none focus:border-[#315df5]"
              >

                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status === "All"
                      ? "All Statuses"
                      : status}
                  </option>
                ))}

              </select>


              {(search ||
                statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="h-12 rounded-xl border border-gray-200 px-5 text-xs font-extrabold text-gray-500 hover:bg-gray-50"
                >
                  Clear
                </button>
              )}

            </div>

          </div>


          {/* =====================================================
              TABLE
          ====================================================== */}

          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_3px_16px_rgba(16,24,40,.035)]">

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>

                <h3 className="text-sm font-extrabold">
                  All Customer Enquiries
                </h3>

                <p className="mt-1 text-[10px] text-gray-400">
                  Latest enquiries appear first
                </p>

              </div>

              <div className="rounded-lg bg-gray-50 px-3 py-1.5 text-[9px] font-bold text-gray-500">
                LIVE
              </div>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="border-b border-gray-100 bg-[#fafbfc] text-left">

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Service
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Received
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Action
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

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#315df5]" />

                        <p className="mt-3 text-xs text-gray-400">
                          Loading enquiries...
                        </p>

                      </td>

                    </tr>

                  ) : filteredEnquiries.length === 0 ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-20 text-center"
                      >

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-xl text-gray-400">
                          ◉
                        </div>

                        <p className="mt-4 text-sm font-extrabold">
                          No enquiries found
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Try changing your search or filter.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    filteredEnquiries.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="border-b border-gray-100 last:border-0 transition hover:bg-[#fafcff]"
                        >

                          {/* CUSTOMER */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[11px] font-extrabold text-blue-700">
                                {initials(
                                  item.name
                                )}
                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[180px] truncate text-xs font-extrabold">
                                  {item.name}
                                </p>

                                <p className="mt-1 text-[9px] text-gray-400">
                                  ID #{item.id}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* CONTACT */}

                          <td className="px-5 py-4">

                            <p className="text-[10px] font-bold text-gray-700">
                              {item.phone}
                            </p>

                            <p className="mt-1 max-w-[190px] truncate text-[9px] text-gray-400">
                              {item.email ||
                                "No email"}
                            </p>

                          </td>


                          {/* SERVICE */}

                          <td className="px-5 py-4">

                            <span className="inline-flex max-w-[180px] truncate rounded-lg bg-gray-50 px-3 py-1.5 text-[10px] font-bold text-gray-600">
                              {item.service}
                            </span>

                          </td>


                          {/* DATE */}

                          <td className="px-5 py-4">

                            <p className="text-[10px] font-bold text-gray-600">
                              {formatDate(
                                item.created_at
                              )}
                            </p>

                          </td>


                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <select
                              value={item.status}
                              onChange={(e) =>
                                updateStatus(
                                  item.id,
                                  e.target.value
                                )
                              }
                              className={`rounded-full border px-3 py-1.5 text-[9px] font-extrabold outline-none ${statusClass(
                                item.status
                              )}`}
                            >

                              {statuses
                                .filter(
                                  (status) =>
                                    status !==
                                    "All"
                                )
                                .map(
                                  (status) => (
                                    <option
                                      key={
                                        status
                                      }
                                      value={
                                        status
                                      }
                                    >
                                      {status}
                                    </option>
                                  )
                                )}

                            </select>

                          </td>


                          {/* ACTION */}

                          <td className="px-5 py-4 text-right">

                            <button
                              onClick={() =>
                                setSelected(
                                  item
                                )
                              }
                              className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-[9px] font-extrabold text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              View Details
                            </button>

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

          <div className="mt-6 flex flex-col justify-between gap-2 border-t border-gray-200 pt-5 text-[9px] text-gray-400 sm:flex-row">

            <p>
              Digital FX • Enquiry Management
            </p>

            <p>
              {enquiries.length} total records
            </p>

          </div>

        </section>

      </div>


      {/* =====================================================
          DETAIL DRAWER
      ====================================================== */}

      {selected && (
        <>

          {/* OVERLAY */}

          <button
            aria-label="Close"
            onClick={() =>
              setSelected(null)
            }
            className="fixed inset-0 z-[80] cursor-default bg-[#071534]/35 backdrop-blur-[2px]"
          />


          {/* DRAWER */}

          <aside className="fixed right-0 top-0 z-[90] flex h-screen w-full max-w-[620px] flex-col bg-[#f5f7fb] shadow-[-25px_0_70px_rgba(7,21,52,.18)]">

            {/* HEADER */}

            <div className="flex min-h-[82px] items-center justify-between border-b border-gray-100 bg-white px-6">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#315df5]">
                  CUSTOMER ENQUIRY
                </p>

                <h2 className="mt-1 text-xl font-extrabold">
                  Enquiry Details
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>

            </div>


            {/* BODY */}

            <div className="flex-1 overflow-y-auto p-5 md:p-6">

              {/* CUSTOMER */}

              <div className="rounded-2xl border border-gray-100 bg-white p-6">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-extrabold text-blue-700">
                    {initials(
                      selected.name
                    )}
                  </div>

                  <div className="min-w-0">

                    <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      CUSTOMER
                    </p>

                    <h3 className="mt-1 truncate text-lg font-extrabold">
                      {selected.name}
                    </h3>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Enquiry #{selected.id}
                    </p>

                  </div>

                </div>

              </div>


              {/* CONTACT */}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <a
                  href={`tel:${selected.phone}`}
                  className="rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-blue-200"
                >

                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                    PHONE
                  </p>

                  <p className="mt-2 truncate text-sm font-extrabold">
                    {selected.phone}
                  </p>

                  <p className="mt-1 text-[9px] font-bold text-blue-500">
                    Call customer →
                  </p>

                </a>


                <a
                  href={
                    selected.email
                      ? `mailto:${selected.email}`
                      : "#"
                  }
                  className="rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-blue-200"
                >

                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                    EMAIL
                  </p>

                  <p className="mt-2 truncate text-sm font-extrabold">
                    {selected.email ||
                      "Not provided"}
                  </p>

                  <p className="mt-1 text-[9px] font-bold text-blue-500">
                    Send email →
                  </p>

                </a>

              </div>


              {/* SERVICE */}

              <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">

                <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                  REQUESTED SERVICE
                </p>

                <div className="mt-3 flex items-center justify-between gap-4">

                  <p className="text-sm font-extrabold">
                    {selected.service}
                  </p>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-[8px] font-extrabold ${statusClass(
                      selected.status
                    )}`}
                  >
                    {selected.status}
                  </span>

                </div>

              </div>


              {/* STATUS */}

              <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">

                <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                  UPDATE STATUS
                </p>

                <select
                  value={selected.status}
                  onChange={(e) =>
                    updateStatus(
                      selected.id,
                      e.target.value
                    )
                  }
                  className="mt-3 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#315df5]"
                >

                  {statuses
                    .filter(
                      (status) =>
                        status !== "All"
                    )
                    .map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}

                </select>

              </div>


              {/* MESSAGE */}

              <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">

                <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                  CUSTOMER MESSAGE
                </p>

                <div className="mt-3 rounded-xl bg-[#f8f9fc] p-4">

                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {selected.message ||
                      "No message provided."}
                  </p>

                </div>

              </div>


              {/* DATE */}

              <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">

                <div className="flex items-center justify-between">

                  <p className="text-xs text-gray-400">
                    Received
                  </p>

                  <p className="text-xs font-bold text-gray-700">
                    {formatDate(
                      selected.created_at
                    )}
                  </p>

                </div>

              </div>

            </div>


            {/* FOOTER */}

            <div className="border-t border-gray-100 bg-white p-5">

              <div className="grid grid-cols-2 gap-3">

                <a
                  href={`tel:${selected.phone}`}
                  className="flex h-12 items-center justify-center rounded-xl bg-[#315df5] text-xs font-extrabold text-white transition hover:bg-[#2449d6]"
                >
                  Call Customer
                </a>


                <a
                  href={`https://wa.me/${selected.phone.replace(
                    /\D/g,
                    ""
                  )}?text=${encodeURIComponent(
                    `Hi ${selected.name}, this is Digital FX regarding your enquiry for ${selected.service}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center rounded-xl bg-[#12b76a] text-xs font-extrabold text-white transition hover:bg-[#079455]"
                >
                  WhatsApp
                </a>

              </div>

            </div>

          </aside>

        </>
      )}

    </main>
  );
}