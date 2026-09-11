import { supabase } from "@/app/lib/supabase";

export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = "";
  try {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token || "";
  } catch {
    // Session retrieval error fallback
  }

  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem("digitalfx_admin_token") || "";
  }

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
