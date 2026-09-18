import { supabase } from "@/app/lib/supabase";

export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = "";

  // 1. Retrieve persistent signed token from localStorage
  if (typeof window !== "undefined") {
    token = localStorage.getItem("digitalfx_admin_token") || "";
  }

  // 2. If no persistent token found, check active Supabase session
  if (!token) {
    try {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token || "";
    } catch {
      // Supabase getSession error fallback
    }
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Always include same-origin credentials so admin_session_token cookie is transmitted
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "same-origin",
  };

  let res = await fetch(url, fetchOptions);

  // 3. Resilient 401 Recovery: attempt automatic Supabase session refresh
  if (res.status === 401 && typeof window !== "undefined") {
    try {
      const { data: refreshData, error: refreshErr } =
        await supabase.auth.refreshSession();

      if (!refreshErr && refreshData?.session?.access_token) {
        const freshToken = refreshData.session.access_token;
        localStorage.setItem("digitalfx_admin_token", freshToken);

        const retryHeaders = new Headers(options.headers || {});
        retryHeaders.set("Authorization", `Bearer ${freshToken}`);

        // Retry the administrative call with newly refreshed token
        const retryRes = await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: "same-origin",
        });

        if (retryRes.ok) {
          return retryRes;
        }
      }
    } catch (e) {
      console.warn("Automated session refresh failed:", e);
    }

    // 4. If refresh fails, session is expired. Clean up zombie state and redirect to login
    if (
      window.location.pathname.startsWith("/admin") &&
      window.location.pathname !== "/admin/login"
    ) {
      localStorage.removeItem("digitalfx_admin");
      localStorage.removeItem("digitalfx_admin_token");
      // Redirect to login with expired prompt
      window.location.href = "/admin/login?expired=true";
    }
  }

  return res;
}
