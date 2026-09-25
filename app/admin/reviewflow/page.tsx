import { redirect } from "next/navigation";

export default function AdminReviewFlowRedirect() {
  redirect("/admin/businesses");
}
