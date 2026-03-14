import { redirect } from "next/navigation";

export default function AdminDashboardAlias() {
  // Align legacy path /dashboard/admin to the actual admin route.
  redirect("/admin");
}
