"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type Enquiry = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string;
  status: string;
  created_at: string;
};

type GeoAnalysis = {
  id: number;
  url: string;
  seo: number;
  performance: number;
  mobile: number;
  content: number;
  geo: number;
  overall: number;
  title: string | null;
  created_at: string;
};


const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "In Progress",
  "Converted",
  "Closed",
];

export default function AdminDashboard() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [geoAnalyses, setGeoAnalyses] = useState<GeoAnalysis[]>([]);

  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(true);

  const [selected, setSelected] = useState<Enquiry | null>(null);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("digitalfx_admin") === "true";

    if (!loggedIn) {
      router.replace("/admin/login");
      return;
    }

    loadDashboard();
  }, [router]);

  async function loadDashboard() {
    setLoading(true);
    setGeoLoading(true);

    // ========================================
    // ENQUIRIES
    // ========================================

    try {
      const enquiryResult = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (enquiryResult.error) {
        console.error(
          "ENQUIRY LOAD ERROR:",
          enquiryResult.error.message
        );

        setEnquiries([]);
      } else {
        setEnquiries(
          (enquiryResult.data || []) as Enquiry[]
        );
      }
    } catch (error) {
      console.error(
        "ENQUIRY REQUEST ERROR:",
        error
      );

      setEnquiries([]);
    }

    // ========================================
    // GEO ANALYSES
    // ========================================

    try {
      const geoResult = await supabase
        .from("geo_analyses")
        .select(
          "id,url,seo,performance,mobile,content,geo,overall,title,created_at"
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(7);

      if (geoResult.error) {
        console.error(
          "GEO LOAD ERROR:",
          geoResult.error.message
        );

        setGeoAnalyses([]);
      } else {
        setGeoAnalyses(
          (geoResult.data || []) as GeoAnalysis[]
        );
      }
    } catch (error) {
      console.error(
        "GEO REQUEST ERROR:",
        error
      );

      setGeoAnalyses([]);
    }

    setLoading(false);
    setGeoLoading(false);
  }

  // ========================================
  // ENQUIRY STATUS
  // ========================================

  async function changeStatus(
    id: number,
    status: string
  ) {
    const { error } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error.message
      );
      return;
    }

    setEnquiries((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    );

    setSelected((current) =>
      current && current.id === id
        ? { ...current, status }
        : current
    );
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
  // DATE
  // ========================================

  function formatDate(
    date?: string
  ) {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
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
  // INITIAL
  // ========================================

  function getInitial(name: string) {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() ||
      "C"
    );
  }

  // ========================================
  // ENQUIRY STATUS STYLE
  // ========================================

  function getStatusClass(status: string) {
    switch (status) {
      case "Converted":
        return "border-emerald-100 bg-emerald-50 text-emerald-700";

      case "In Progress":
        return "border-violet-100 bg-violet-50 text-violet-700";

      case "Contacted":
        return "border-amber-100 bg-amber-50 text-amber-700";

      case "Closed":
        return "border-gray-200 bg-gray-100 text-gray-600";

      default:
        return "border-blue-100 bg-blue-50 text-blue-700";
    }
  }


  // ========================================
  // SCORE STYLE
  // ========================================

  function getScoreClass(score: number) {
    if (score >= 80) {
      return "text-emerald-600";
    }

    if (score >= 60) {
      return "text-amber-600";
    }

    return "text-red-500";
  }

  // ========================================
  // ENQUIRY STATS
  // ========================================

  const total = enquiries.length;

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

  const recentEnquiries =
    enquiries.slice(0, 7);

  // ========================================
  // GEO STATS
  // ========================================

  const totalGeoAnalyses =
    geoAnalyses.length;

  const averageOverall =
    totalGeoAnalyses > 0
      ? Math.round(
          geoAnalyses.reduce(
            (sum, item) =>
              sum + Number(item.overall || 0),
            0
          ) / totalGeoAnalyses
        )
      : 0;

  const averageGeo =
    totalGeoAnalyses > 0
      ? Math.round(
          geoAnalyses.reduce(
            (sum, item) =>
              sum + Number(item.geo || 0),
            0
          ) / totalGeoAnalyses
        )
      : 0;

  const averageSeo =
    totalGeoAnalyses > 0
      ? Math.round(
          geoAnalyses.reduce(
            (sum, item) =>
              sum + Number(item.seo || 0),
            0
          ) / totalGeoAnalyses
        )
      : 0;


  // ========================================
  // SIDEBAR
  // ========================================

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#071534]">

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col bg-[#071534] text-white lg:flex">

        <div className="flex h-[82px] shrink-0 items-center border-b border-white/10 px-5">

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

              <div className="mt-0.5 text-[7px] font-bold tracking-[2px] text-blue-100/45">
                ADMIN PANEL
              </div>

            </div>

          </button>

        </div>

        <nav className="flex-1 overflow-y-auto p-4">

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl bg-[#315df5] px-4 py-3 text-sm font-bold text-white"
          >
            <span className="w-5 text-center">
              ▦
            </span>
            Dashboard
          </button>

          <button
            onClick={() =>
              router.push("/admin/enquiries")
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center">
              ◉
            </span>

            Enquiries

            {newCount > 0 && (
              <span className="ml-auto rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] text-blue-200">
                {newCount}
              </span>
            )}
          </button>


          <button
            onClick={() =>
              router.push("/admin/payments")
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center">
              ₹
            </span>
            Payments
          </button>

          <button
            onClick={() =>
              router.push("/admin/services")
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center">
              ◇
            </span>
            Services
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ▣
            </span>
            Projects
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ▤
            </span>
            Blogs
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ★
            </span>
            Testimonials
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ◎
            </span>
            Partners
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ◌
            </span>
            Team Members
          </button>

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

          <button
            onClick={() =>
              router.push(
                "/admin/geo-checker/history"
              )
            }
            className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white"
          >
            <span className="w-5 text-center">
              ◷
            </span>
            GEO History
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ✉
            </span>
            Subscribers
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ▤
            </span>
            Pages
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ◒
            </span>
            Analytics
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ▥
            </span>
            Reports
          </button>

          <button className="mb-1.5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-blue-100/55 hover:bg-white/5 hover:text-white">
            <span className="w-5 text-center">
              ⚙
            </span>
            Settings
          </button>

        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">

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
              className="text-lg text-blue-100/45 hover:text-white"
            >
              ↪
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <div className="lg:ml-[260px]">

        {/* HEADER */}

        <header className="flex min-h-[82px] items-center justify-between border-b border-gray-100 bg-white px-5 md:px-8">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-gray-400">
              DIGITAL FX ADMIN
            </p>

            <h1 className="mt-1 text-xl font-extrabold">
              Dashboard
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={loadDashboard}
              className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold text-gray-600 hover:bg-gray-50"
            >
              ↻ Refresh
            </button>

            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-600 sm:flex">
              A
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <section className="p-5 md:p-8">

          {/* WELCOME */}

          <div className="mb-7">

            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#315df5]">
              OVERVIEW
            </p>

            <h2 className="mt-2 text-[30px] font-extrabold tracking-[-1px]">
              Welcome back, Admin.
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Here&apos;s what&apos;s happening across
              your Digital FX workspace.
            </p>

          </div>

          {/* ENQUIRY STATS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
                Total Enquiries
              </p>

              <p className="mt-3 text-[30px] font-extrabold">
                {total}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-gray-400">
                All customer leads
              </p>

            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
                New Enquiries
              </p>

              <p className="mt-3 text-[30px] font-extrabold text-blue-600">
                {newCount}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-gray-400">
                Waiting for contact
              </p>

            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
                In Progress
              </p>

              <p className="mt-3 text-[30px] font-extrabold text-violet-600">
                {progressCount}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-gray-400">
                Active leads
              </p>

            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
                Converted
              </p>

              <p className="mt-3 text-[30px] font-extrabold text-emerald-600">
                {convertedCount}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-gray-400">
                Successful leads
              </p>

            </div>

          </div>

          {/* GEO OVERVIEW */}

          <div className="mt-7">

            <div className="mb-4">

              <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-emerald-600">
                WEBSITE INTELLIGENCE
              </p>

              <h3 className="mt-1 text-lg font-extrabold">
                GEO Checker Overview
              </h3>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
                  GEO Analyses
                </p>

                <p className="mt-3 text-[30px] font-extrabold">
                  {geoLoading
                    ? "—"
                    : totalGeoAnalyses}
                </p>

                <p className="mt-1 text-[10px] font-semibold text-gray-400">
                  Websites analyzed
                </p>

              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
                  Average Overall
                </p>

                <p
                  className={`mt-3 text-[30px] font-extrabold ${getScoreClass(
                    averageOverall
                  )}`}
                >
                  {geoLoading
                    ? "—"
                    : averageOverall}

                  {!geoLoading && (
                    <span className="ml-1 text-sm text-gray-400">
                      /100
                    </span>
                  )}

                </p>

                <p className="mt-1 text-[10px] font-semibold text-gray-400">
                  Website health score
                </p>

              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
                  Average GEO
                </p>

                <p
                  className={`mt-3 text-[30px] font-extrabold ${getScoreClass(
                    averageGeo
                  )}`}
                >
                  {geoLoading
                    ? "—"
                    : averageGeo}

                  {!geoLoading && (
                    <span className="ml-1 text-sm text-gray-400">
                      /100
                    </span>
                  )}

                </p>

                <p className="mt-1 text-[10px] font-semibold text-gray-400">
                  Local visibility signal
                </p>

              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-gray-400">
                  Average SEO
                </p>

                <p
                  className={`mt-3 text-[30px] font-extrabold ${getScoreClass(
                    averageSeo
                  )}`}
                >
                  {geoLoading
                    ? "—"
                    : averageSeo}

                  {!geoLoading && (
                    <span className="ml-1 text-sm text-gray-400">
                      /100
                    </span>
                  )}

                </p>

                <p className="mt-1 text-[10px] font-semibold text-gray-400">
                  Search optimization
                </p>

              </div>

            </div>

          </div>

          {/* RECENT ENQUIRIES + PIPELINE */}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">

                <div>

                  <h3 className="text-sm font-extrabold">
                    Recent Enquiries
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Latest customer enquiries
                  </p>

                </div>

                <button
                  onClick={() =>
                    router.push(
                      "/admin/enquiries"
                    )
                  }
                  className="text-[10px] font-extrabold text-[#315df5]"
                >
                  View All →
                </button>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[650px]">

                  <thead>

                    <tr className="border-b border-gray-100 bg-gray-50/60 text-left">

                      <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                        Customer
                      </th>

                      <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                        Service
                      </th>

                      <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                        Status
                      </th>

                      <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {loading ? (

                      <tr>

                        <td
                          colSpan={4}
                          className="py-16 text-center"
                        >
                          Loading...
                        </td>

                      </tr>

                    ) : recentEnquiries.length === 0 ? (

                      <tr>

                        <td
                          colSpan={4}
                          className="py-16 text-center text-sm text-gray-400"
                        >
                          No enquiries yet
                        </td>

                      </tr>

                    ) : (

                      recentEnquiries.map(
                        (item) => (

                          <tr
                            key={item.id}
                            className="border-b border-gray-100 last:border-0 hover:bg-[#fafcff]"
                          >

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-xs font-extrabold text-blue-700">
                                  {getInitial(
                                    item.name
                                  )}
                                </div>

                                <div>

                                  <p className="max-w-[170px] truncate text-xs font-extrabold">
                                    {item.name}
                                  </p>

                                  <p className="mt-1 text-[9px] text-gray-400">
                                    {item.phone}
                                  </p>

                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4">

                              <span className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-[10px] font-bold text-gray-600">
                                {item.service}
                              </span>

                            </td>

                            <td className="px-5 py-4">

                              <select
                                value={item.status}
                                onChange={(e) =>
                                  changeStatus(
                                    item.id,
                                    e.target.value
                                  )
                                }
                                className={`rounded-full border px-2.5 py-1.5 text-[8px] font-extrabold outline-none ${getStatusClass(
                                  item.status
                                )}`}
                              >

                                {STATUS_OPTIONS.map(
                                  (status) => (

                                    <option
                                      key={status}
                                      value={status}
                                    >
                                      {status}
                                    </option>

                                  )
                                )}

                              </select>

                            </td>

                            <td className="px-5 py-4">

                              <button
                                onClick={() =>
                                  setSelected(
                                    item
                                  )
                                }
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-[9px] font-extrabold text-gray-600"
                              >
                                View
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

            {/* PIPELINE */}

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

              <h3 className="text-sm font-extrabold">
                Lead Pipeline
              </h3>

              <p className="mt-1 text-[10px] text-gray-400">
                Current enquiry distribution
              </p>

              <div className="mt-7 space-y-5">

                {[
                  {
                    label: "New",
                    count: newCount,
                    color: "bg-[#315df5]",
                  },
                  {
                    label: "Contacted",
                    count: contactedCount,
                    color: "bg-amber-400",
                  },
                  {
                    label: "In Progress",
                    count: progressCount,
                    color: "bg-violet-500",
                  },
                  {
                    label: "Converted",
                    count: convertedCount,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Closed",
                    count: closedCount,
                    color: "bg-gray-400",
                  },
                ].map((item) => (

                  <div key={item.label}>

                    <div className="mb-2 flex justify-between">

                      <span className="text-xs font-bold text-gray-600">
                        {item.label}
                      </span>

                      <span className="text-xs font-extrabold">
                        {item.count}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{
                          width:
                            total > 0
                              ? `${(item.count / total) * 100}%`
                              : "0%",
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* GEO HISTORY */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5">

              <div>

                <h3 className="text-sm font-extrabold">
                  Recent GEO Analyses
                </h3>

                <p className="mt-1 text-[10px] text-gray-400">
                  Latest website visibility checks
                </p>

              </div>

              <button
                onClick={() =>
                  router.push(
                    "/admin/geo-checker/history"
                  )
                }
                className="rounded-xl bg-[#315df5] px-4 py-2 text-[10px] font-extrabold text-white"
              >
                View GEO History →
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead>

                  <tr className="border-b border-gray-100 bg-gray-50/60 text-left">

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Website
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Overall
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      SEO
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      GEO
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Date
                    </th>

                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {geoLoading ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-14 text-center text-sm text-gray-400"
                      >
                        Loading GEO analyses...
                      </td>

                    </tr>

                  ) : geoAnalyses.length === 0 ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="py-14 text-center"
                      >

                        <div className="text-2xl">
                          ⌖
                        </div>

                        <p className="mt-2 text-sm font-bold text-gray-400">
                          No GEO analyses yet
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          Analyze a website from GEO Checker.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    geoAnalyses.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="border-b border-gray-100 last:border-0 hover:bg-[#fafcff]"
                        >

                          <td className="px-5 py-4">

                            <div className="max-w-[330px]">

                              <p className="truncate text-xs font-extrabold">
                                {item.title ||
                                  item.url}
                              </p>

                              <p className="mt-1 truncate text-[9px] text-gray-400">
                                {item.url}
                              </p>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`text-sm font-extrabold ${getScoreClass(
                                Number(
                                  item.overall
                                )
                              )}`}
                            >
                              {item.overall}
                            </span>

                            <span className="ml-1 text-[9px] text-gray-400">
                              /100
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`text-xs font-extrabold ${getScoreClass(
                                Number(
                                  item.seo
                                )
                              )}`}
                            >
                              {item.seo}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`text-xs font-extrabold ${getScoreClass(
                                Number(
                                  item.geo
                                )
                              )}`}
                            >
                              {item.geo}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span className="text-[10px] text-gray-500">
                              {formatDate(
                                item.created_at
                              )}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/geo-checker?url=${encodeURIComponent(
                                    item.url
                                  )}`
                                )
                              }
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-[9px] font-extrabold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              View
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

          {/* QUICK ACTIONS */}

          <div className="mt-6">

            <h3 className="text-sm font-extrabold">
              Quick Actions
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <button
                onClick={() =>
                  router.push(
                    "/admin/enquiries"
                  )
                }
                className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm"
              >

                <div className="text-xl text-blue-600">
                  ◉
                </div>

                <p className="mt-4 text-sm font-extrabold">
                  Manage Enquiries
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  View and manage customer leads
                </p>

              </button>


              <button
                onClick={() =>
                  router.push(
                    "/admin/services"
                  )
                }
                className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm"
              >

                <div className="text-xl text-violet-600">
                  ◇
                </div>

                <p className="mt-4 text-sm font-extrabold">
                  Manage Services
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Update digital services
                </p>

              </button>

              <button
                onClick={() =>
                  router.push(
                    "/admin/geo-checker"
                  )
                }
                className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm"
              >

                <div className="text-xl text-emerald-600">
                  ⌖
                </div>

                <p className="mt-4 text-sm font-extrabold">
                  GEO Checker
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Analyze website visibility
                </p>

              </button>

            </div>

          </div>

          <div className="mt-8 border-t border-gray-200 pt-5 text-[9px] text-gray-400">
            Digital FX Admin Dashboard • Live data • Supabase
          </div>

        </section>

      </div>

      {/* ENQUIRY DRAWER */}

      {selected && (
        <>

          <div
            onClick={() =>
              setSelected(null)
            }
            className="fixed inset-0 z-[80] bg-[#071534]/30"
          />

          <aside className="fixed right-0 top-0 z-[90] flex h-screen w-full max-w-[680px] flex-col overflow-hidden bg-[#f5f7fb] shadow-xl">

            <div className="flex h-[82px] items-center justify-between border-b border-gray-100 bg-white px-6">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#315df5]">
                  CUSTOMER MANAGEMENT
                </p>

                <h2 className="mt-1 text-xl font-extrabold">
                  Enquiry Details
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl text-gray-500"
              >
                ×
              </button>

            </div>

            <div className="flex-1 overflow-y-auto p-5">

              <div className="rounded-2xl border border-gray-100 bg-white p-6">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-extrabold text-blue-700">
                    {getInitial(
                      selected.name
                    )}
                  </div>

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      CUSTOMER
                    </p>

                    <h3 className="mt-1 text-lg font-extrabold">
                      {selected.name}
                    </h3>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Enquiry #{selected.id}
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <a
                  href={`tel:${selected.phone}`}
                  className="rounded-2xl border border-gray-100 bg-white p-5"
                >

                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                    PHONE
                  </p>

                  <p className="mt-2 text-sm font-extrabold">
                    {selected.phone}
                  </p>

                </a>

                <a
                  href={
                    selected.email
                      ? `mailto:${selected.email}`
                      : undefined
                  }
                  className="rounded-2xl border border-gray-100 bg-white p-5"
                >

                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                    EMAIL
                  </p>

                  <p className="mt-2 truncate text-sm font-extrabold">
                    {selected.email ||
                      "Not provided"}
                  </p>

                </a>

              </div>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">

                <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                  REQUESTED SERVICE
                </p>

                <p className="mt-2 text-sm font-extrabold">
                  {selected.service}
                </p>

              </div>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                      STATUS
                    </p>

                    <p className="mt-2 text-sm font-extrabold">
                      {selected.status}
                    </p>

                  </div>

                  <select
                    value={selected.status}
                    onChange={(e) =>
                      changeStatus(
                        selected.id,
                        e.target.value
                      )
                    }
                    className={`rounded-xl border px-3 py-2 text-xs font-bold outline-none ${getStatusClass(
                      selected.status
                    )}`}
                  >

                    {STATUS_OPTIONS.map(
                      (status) => (

                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">

                <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
                  CUSTOMER MESSAGE
                </p>

                <div className="mt-4 rounded-xl bg-[#f8f9fc] p-4">

                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {selected.message ||
                      "No message provided."}
                  </p>

                </div>

              </div>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">

                <div className="flex justify-between">

                  <span className="text-xs text-gray-400">
                    Received
                  </span>

                  <span className="text-xs font-bold">
                    {formatDate(
                      selected.created_at
                    )}
                  </span>

                </div>

              </div>

            </div>

            <div className="border-t border-gray-100 bg-white p-5">

              <div className="grid grid-cols-2 gap-3">

                <a
                  href={`tel:${selected.phone}`}
                  className="flex h-12 items-center justify-center rounded-xl bg-[#315df5] text-xs font-extrabold text-white"
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
                  className="flex h-12 items-center justify-center rounded-xl bg-[#12b76a] text-xs font-extrabold text-white"
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