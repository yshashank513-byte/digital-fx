import { redirect } from "next/navigation";

export default function AdminReviewFlowRedirect() {
  redirect("/reviewflow/dashboard");
}
