"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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
  description: string | null;
  h1_count: number;
  image_count: number;
  images_without_alt: number;
  has_viewport: boolean;
  has_canonical: boolean;
  has_robots: boolean;
  response_time: number;
  recommendations: string[];
  ai_analysis: any;
  created_at: string;
};

export default function GeoHistoryPage() {
  const router = useRouter();

  const [analyses, setAnalyses] =
    useState<GeoAnalysis[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("digitalfx_admin") ===
      "true";

    if (!loggedIn) {
      router.replace("/admin/login");
      return;
    }

    loadHistory();
  }, [router]);

  async function loadHistory() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("geo_analyses")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "GEO HISTORY ERROR:",
        error.message
      );

      setAnalyses([]);
    } else {
      setAnalyses(
        (data || []) as GeoAnalysis[]
      );
    }

    setLoading(false);
  }

  function formatDate(date: string) {
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

  function scoreColor(score: number) {
    if (score >= 80)
      return "text-emerald-600";

    if (score >= 60)
      return "text-amber-600";

    return "text-red-500";
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#071534]">

      {/* HEADER */}

      <header className="sticky top-0 z-30 flex min-h-[82px] items-center justify-between border-b border-gray-100 bg-white px-5 md:px-8">

        <div>

          <button
            onClick={() =>
              router.push("/admin")
            }
            className="mb-1 text-[10px] font-bold text-[#315df5]"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-xl font-extrabold">
            GEO Analysis History
          </h1>

          <p className="mt-1 text-[10px] text-gray-400">
            Complete website analysis history
          </p>

        </div>

        <button
          onClick={() =>
            router.push(
              "/admin/geo-checker"
            )
          }
          className="rounded-xl bg-[#315df5] px-4 py-2.5 text-[10px] font-extrabold text-white"
        >
          + New Analysis
        </button>

      </header>

      {/* CONTENT */}

      <section className="p-5 md:p-8">

        {/* SUMMARY */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
              Total Analyses
            </p>

            <p className="mt-3 text-3xl font-extrabold">
              {analyses.length}
            </p>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
              Average Overall
            </p>

            <p className="mt-3 text-3xl font-extrabold text-[#315df5]">

              {analyses.length
                ? Math.round(
                    analyses.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          item.overall || 0
                        ),
                      0
                    ) /
                      analyses.length
                  )
                : 0}

              <span className="ml-1 text-sm text-gray-400">
                /100
              </span>

            </p>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <p className="text-[9px] font-bold uppercase tracking-[1px] text-gray-400">
              Latest Analysis
            </p>

            <p className="mt-3 text-sm font-extrabold">

              {analyses.length
                ? formatDate(
                    analyses[0].created_at
                  )
                : "No analysis"}

            </p>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-5">

            <h2 className="text-sm font-extrabold">
              Website Analysis Records
            </h2>

            <p className="mt-1 text-[10px] text-gray-400">
              Click View to open the complete report.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

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
                    Performance
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

                {loading ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="py-16 text-center text-sm text-gray-400"
                    >
                      Loading analysis history...
                    </td>

                  </tr>

                ) : analyses.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="py-16 text-center"
                    >

                      <div className="text-3xl">
                        ⌖
                      </div>

                      <p className="mt-3 text-sm font-bold text-gray-400">
                        No GEO analyses found
                      </p>

                    </td>

                  </tr>

                ) : (

                  analyses.map(
                    (item) => (

                      <tr
                        key={item.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-[#fafcff]"
                      >

                        <td className="px-5 py-4">

                          <div className="max-w-[300px]">

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
                            className={`text-sm font-extrabold ${scoreColor(
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
                            className={`text-xs font-extrabold ${scoreColor(
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
                            className={`text-xs font-extrabold ${scoreColor(
                              Number(
                                item.geo
                              )
                            )}`}
                          >
                            {item.geo}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`text-xs font-extrabold ${scoreColor(
                              Number(
                                item.performance
                              )
                            )}`}
                          >
                            {item.performance}
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
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-[9px] font-extrabold text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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

      </section>

    </main>
  );
}