import { redirect } from "next/navigation";

export default function OldReviewFlowDashboardRedirect() {
  redirect("/admin/businesses");
}
