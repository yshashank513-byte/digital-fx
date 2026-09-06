"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (
      email === "admin@digitalfx.in" &&
      password === "DigitalFX@2026"
    ) {
      localStorage.setItem(
        "digitalfx_admin",
        "true"
      );

      if (remember) {
        localStorage.setItem(
          "digitalfx_remember",
          "true"
        );
      } else {
        localStorage.removeItem(
          "digitalfx_remember"
        );
      }

      router.push("/admin");
      return;
    }

    setError(
      "The email or password you entered is incorrect."
    );

    setLoading(false);
  }

  function handleGoogleLogin() {
    setError(
      "Google Sign In will be connected with Supabase Authentication."
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6fa]">

      <div className="flex min-h-screen">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <section className="relative hidden min-h-screen w-[52%] overflow-hidden bg-[#06132f] lg:block">

          {/* GRID */}

          <div
            className="absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* BLUE GLOW */}

          <div className="absolute -left-52 top-[12%] h-[620px] w-[620px] rounded-full bg-[#315df5]/20 blur-[140px]" />

          <div className="absolute -right-52 bottom-[-100px] h-[650px] w-[650px] rounded-full bg-[#6547f6]/20 blur-[150px]" />

          {/* DECORATIVE CIRCLES */}

          <div className="absolute right-[8%] top-[15%] h-36 w-36 rounded-full border border-white/[0.04]" />

          <div className="absolute right-[11%] top-[18%] h-20 w-20 rounded-full border border-[#6d8cff]/10" />

          <div className="relative z-10 flex min-h-screen flex-col px-12 py-10 xl:px-16">


            {/* =================================================
                BRAND
            ================================================= */}

            <div className="flex items-center gap-4">

              {/* 3D LOGO */}

              <div className="relative flex h-[70px] w-[76px] items-center justify-center">

                {/* glow */}

                <div className="absolute inset-1 rounded-[22px] bg-[#315df5]/30 blur-xl" />

                {/* glass base */}

                <div className="absolute inset-1 rounded-[20px] border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_18px_45px_rgba(0,0,0,.35)] backdrop-blur-md" />

                {/* logo */}

                <img
                  src="/logo.png"
                  alt="Digital FX"
                  className="relative z-10 h-[67px] w-[73px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,.45)]"
                />

              </div>


              <div>

                <div className="text-[28px] font-black tracking-[-1.2px] text-white">

                  DIGITAL{" "}

                  <span className="bg-gradient-to-r from-[#6f8cff] to-[#9b7cff] bg-clip-text text-transparent">
                    FX
                  </span>

                </div>

                <div className="mt-1 text-[8px] font-bold tracking-[3px] text-[#7d8eb5]">
                  DIGITAL MARKETING
                </div>

              </div>

            </div>


            {/* =================================================
                HERO
            ================================================= */}

            <div className="mt-[92px]">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#607bff]/20 bg-[#315df5]/10 px-4 py-2">

                <span className="relative flex h-2 w-2">

                  <span className="absolute h-full w-full animate-ping rounded-full bg-[#6d8cff] opacity-60" />

                  <span className="relative h-2 w-2 rounded-full bg-[#6d8cff]" />

                </span>

                <span className="text-[9px] font-bold uppercase tracking-[2px] text-[#a4b3ff]">
                  Digital FX Command Center
                </span>

              </div>


              <h1 className="max-w-[680px] text-[48px] font-black leading-[1.03] tracking-[-2.8px] text-white xl:text-[62px]">

                Your Digital

                <span className="block">
                  Business.
                </span>

                <span className="block bg-gradient-to-r from-[#6c8cff] via-[#7888ff] to-[#9b7bff] bg-clip-text text-transparent">
                  One Workspace.
                </span>

              </h1>


              <p className="mt-7 max-w-[590px] text-[15px] leading-7 text-[#9ba9c4]">
                Manage enquiries, customers, services,
                campaigns and digital performance from
                one centralized workspace.
              </p>

            </div>


            {/* =================================================
                ANALYTICS
            ================================================= */}

            <div className="relative mt-14">

              <div className="rounded-[21px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_30px_90px_rgba(0,0,0,.3)] backdrop-blur-xl">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[8px] font-bold tracking-[2px] text-[#667491]">
                      LIVE OVERVIEW
                    </p>

                    <p className="mt-1 text-[19px] font-black text-white">
                      Business Intelligence
                    </p>

                  </div>


                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#12b76a]" />

                    <span className="text-[8px] font-bold text-[#8d9ab5]">
                      SYSTEM ACTIVE
                    </span>

                  </div>

                </div>


                {/* STATS */}

                <div className="mt-6 grid grid-cols-3 gap-3">

                  {[
                    [
                      "ENQUIRIES",
                      "1,248",
                      "+12.5%",
                    ],
                    [
                      "PROJECTS",
                      "342",
                      "+8.4%",
                    ],
                    [
                      "REVENUE",
                      "₹8.45L",
                      "+20.6%",
                    ],
                  ].map(
                    ([label, number, growth]) => (

                      <div
                        key={label}
                        className="rounded-xl border border-white/5 bg-black/10 p-4"
                      >

                        <p className="text-[8px] font-bold tracking-[1px] text-[#62708d]">
                          {label}
                        </p>

                        <p className="mt-2 text-[22px] font-black text-white">
                          {number}
                        </p>

                        <p className="mt-1 text-[9px] font-bold text-[#32d583]">
                          {growth}
                        </p>

                      </div>

                    )
                  )}

                </div>


                {/* CHART */}

                <div className="mt-7">

                  <div className="mb-3 flex items-center justify-between">

                    <span className="text-[8px] font-bold tracking-[1.5px] text-[#687594]">
                      DIGITAL PERFORMANCE
                    </span>

                    <span className="text-[8px] text-[#53617d]">
                      LAST 30 DAYS
                    </span>

                  </div>


                  <div className="flex h-[130px] items-end gap-2">

                    {[
                      32,
                      43,
                      39,
                      52,
                      48,
                      61,
                      57,
                      68,
                      63,
                      77,
                      73,
                      92,
                    ].map(
                      (height, index) => (

                        <div
                          key={index}
                          className="flex h-full flex-1 items-end"
                        >

                          <div
                            style={{
                              height: `${height}%`,
                            }}
                            className="w-full rounded-t-[4px] bg-gradient-to-t from-[#315df5] to-[#7890ff] shadow-[0_0_15px_rgba(49,93,245,.15)]"
                          />

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>


              {/* FLOATING CARD */}

              <div className="absolute -bottom-7 -right-5 rounded-2xl border border-white/10 bg-[#111f45] px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,.3)]">

                <p className="text-[8px] font-bold tracking-[1.5px] text-[#657392]">
                  LEAD CONVERSION
                </p>

                <div className="mt-1 flex items-end gap-2">

                  <span className="text-[27px] font-black text-white">
                    72%
                  </span>

                  <span className="mb-1 text-[9px] font-bold text-[#32d583]">
                    +9.2%
                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                FEATURES
            ================================================= */}

            <div className="mt-auto grid grid-cols-3 gap-6 pt-16">

              {[
                [
                  "✓",
                  "Secure",
                  "Protected admin access",
                  "blue",
                ],
                [
                  "◈",
                  "Intelligent",
                  "Smart business insights",
                  "purple",
                ],
                [
                  "●",
                  "Control",
                  "Complete management",
                  "green",
                ],
              ].map(
                ([icon, title, description, color]) => (

                  <div key={title}>

                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                        color === "blue"
                          ? "bg-[#315df5]/10 text-[#6f8cff]"
                          : color === "purple"
                          ? "bg-[#7047f5]/10 text-[#9b82ff]"
                          : "bg-[#12b76a]/10 text-[#32d583]"
                      }`}
                    >
                      {icon}
                    </div>

                    <p className="text-xs font-bold text-white">
                      {title}
                    </p>

                    <p className="mt-1 text-[9px] leading-5 text-[#63708d]">
                      {description}
                    </p>

                  </div>

                )
              )}

            </div>


            <p className="mt-10 text-[9px] text-[#485674]">
              © 2026 Digital FX. All rights reserved.
            </p>

          </div>

        </section>


        {/* =====================================================
            RIGHT LOGIN PANEL
        ===================================================== */}

        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-5 py-10 sm:px-10 lg:w-[48%] lg:px-14 xl:px-20">

          {/* Mobile glow */}

          <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[#315df5]/5 blur-3xl lg:hidden" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#7047f5]/5 blur-3xl lg:hidden" />


          <div className="relative z-10 w-full max-w-[450px]">


            {/* MOBILE BRAND */}

            <div className="mb-12 flex items-center gap-3 lg:hidden">

              <div className="relative flex h-[60px] w-[66px] items-center justify-center">

                <div className="absolute inset-1 rounded-2xl bg-[#315df5]/10 blur-lg" />

                <img
                  src="/logo.png"
                  alt="Digital FX"
                  className="relative h-[58px] w-[64px] object-contain drop-shadow-[0_8px_10px_rgba(49,93,245,.22)]"
                />

              </div>


              <div>

                <p className="text-[24px] font-black tracking-[-1px] text-[#07122d]">

                  DIGITAL{" "}

                  <span className="text-[#315df5]">
                    FX
                  </span>

                </p>

                <p className="mt-1 text-[7px] font-bold tracking-[2.5px] text-[#98a2b3]">
                  ADMIN COMMAND CENTER
                </p>

              </div>

            </div>


            {/* HEADER */}

            <div>

              <div className="mb-5 hidden items-center gap-2 lg:flex">

                <span className="h-2 w-2 rounded-full bg-[#12b76a]" />

                <span className="text-[9px] font-black uppercase tracking-[2px] text-[#667085]">
                  Secure Administrator Access
                </span>

              </div>


              <h2 className="text-[38px] font-black leading-tight tracking-[-2px] text-black sm:text-[44px]">
                Welcome back.
              </h2>


              <p className="mt-4 text-[14px] leading-6 text-[#667085]">
                Sign in to access your Digital FX
                management workspace.
              </p>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleLogin}
              className="mt-9"
            >

              {/* EMAIL */}

              <div>

                <label className="mb-2.5 block text-[12px] font-black text-black">
                  Email address
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]">

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />

                      <path d="m3 7 9 6 9-6" />
                    </svg>

                  </div>


                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="admin@digitalfx.in"
                    required
                    autoComplete="email"
                    className="h-[56px] w-full rounded-xl border border-[#d0d5dd] bg-white pl-12 pr-4 text-[13px] font-medium text-black outline-none transition placeholder:text-[#98a2b3] focus:border-[#315df5] focus:ring-4 focus:ring-[#315df5]/10"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="mt-6">

                <div className="mb-2.5 flex items-center justify-between">

                  <label className="text-[12px] font-black text-black">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setError(
                        "Password recovery will be connected with Supabase Authentication."
                      )
                    }
                    className="text-[11px] font-bold text-black hover:text-[#315df5]"
                  >
                    Forgot password?
                  </button>

                </div>


                <div className="relative">

                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]">

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >

                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                      />

                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                    </svg>

                  </div>


                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="h-[56px] w-full rounded-xl border border-[#d0d5dd] bg-white pl-12 pr-20 text-[13px] font-medium text-black outline-none transition placeholder:text-[#98a2b3] focus:border-[#315df5] focus:ring-4 focus:ring-[#315df5]/10"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-black hover:text-[#315df5]"
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              {/* REMEMBER */}

              <div className="mt-5">

                <label className="flex cursor-pointer items-center gap-3 text-[12px] font-semibold text-black">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-[#d0d5dd] accent-[#315df5]"
                  />

                  Remember me on this device

                </label>

              </div>


              {/* ERROR */}

              {error && (

                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold leading-5 text-red-600">
                  {error}
                </div>

              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 flex h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-[#315df5] text-[13px] font-black text-white shadow-[0_14px_35px_rgba(49,93,245,.20)] transition hover:bg-[#2449d6] hover:shadow-[0_18px_40px_rgba(49,93,245,.25)] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (

                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Signing in...
                  </>

                ) : (

                  <>
                    Sign in to Dashboard

                    <span className="text-lg">
                      →
                    </span>
                  </>

                )}

              </button>


              {/* DIVIDER */}

              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-[#eaecf0]" />

                <span className="text-[9px] font-black tracking-[1px] text-[#98a2b3]">
                  OR CONTINUE WITH
                </span>

                <div className="h-px flex-1 bg-[#eaecf0]" />

              </div>


              {/* GOOGLE */}

              <button
                type="button"
                onClick={
                  handleGoogleLogin
                }
                className="flex h-[56px] w-full items-center justify-center gap-3 rounded-xl border border-[#d0d5dd] bg-white text-[13px] font-black text-black transition hover:border-[#98a2b3] hover:bg-[#fafafa] hover:shadow-sm"
              >

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >

                  <path
                    fill="#4285F4"
                    d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.5Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.54 13.6a5.87 5.87 0 0 1 0-3.2V7.87H3.3a9.75 9.75 0 0 0 0 8.26l3.24-2.53Z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 6.37c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.42 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.37l3.24 2.53C7.31 8.09 9.46 6.37 12 6.37Z"
                  />

                </svg>

                Sign in with Google

              </button>

            </form>


            {/* SECURITY */}

            <div className="mt-9 flex items-center justify-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ecfdf3] text-[#12b76a]">
                ✓
              </div>

              <p className="text-[10px] font-semibold text-[#667085]">
                Secure administrator connection
              </p>

            </div>


            {/* SUPPORT */}

            <p className="mt-7 text-center text-[11px] text-[#98a2b3]">

              Need help?{" "}

              <a
                href="mailto:hello@digitalfx.in"
                className="font-black text-black hover:text-[#315df5]"
              >
                Contact Digital FX Support
              </a>

            </p>


            <p className="mt-8 text-center text-[9px] text-[#c0c5ce]">
              © 2026 Digital FX • Admin Portal
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}