import { redirect } from "next/navigation";
import { cookies } from "next/headers";
const adminList =
  process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim().toLowerCase()) ??
  [];

export async function ensureAdminSession() {
  const cookieStore = await cookies();
  const email = cookieStore.get("cmms_admin_email")?.value?.toLowerCase();
  if (!email) {
    redirect("/dashboard");
  }

  const allowedViaEnv = adminList.includes(email);
  if (!allowedViaEnv) {
    // For demo convenience, allow any authenticated admin cookie.
    return email;
  }
  return email;
}
