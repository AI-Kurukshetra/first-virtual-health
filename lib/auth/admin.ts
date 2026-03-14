import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const adminList =
  process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()) ??
  [];

export async function ensureAdminSession() {
  const cookieStore = await cookies();
  const email = cookieStore.get("cmms_admin_email")?.value?.toLowerCase();
  if (!email || !adminList.includes(email)) {
    redirect("/dashboard");
  }

  return email;
}
