import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OldReviewFlowDashboardRedirect() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session_token")?.value;

  if (!sessionToken) {
    redirect("/admin/login?from=/admin/reviewflow");
  }

  redirect("/admin/reviewflow");
}
