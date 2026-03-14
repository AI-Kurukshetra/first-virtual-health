"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Enter both email and password." };
  }

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Supabase environment variables missing");
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    const cookieStore = await cookies();
    cookieStore.set("cmms_admin_email", email, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      path: "/",
    });
  } catch (error) {
    console.error("Login failed", error);
    return {
      status: "error",
      message: "Unexpected error while contacting Supabase auth.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("cmms_admin_email");
  redirect("/login");
}
