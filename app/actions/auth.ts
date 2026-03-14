"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

export type AuthFormState = {
  status: "idle" | "error";
  message?: string;
};

const missingEnv = () =>
  !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createSupabaseAuthClient() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
  return supabase;
}

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
    if (missingEnv()) {
      throw new Error("Supabase environment variables missing");
    }

    const supabase = createSupabaseAuthClient();

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

export async function adminLoginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Enter admin email and password." };
  }

  try {
    if (missingEnv()) {
      throw new Error("Supabase environment variables missing");
    }

    const authClient = createSupabaseAuthClient();
    const { error } = await authClient.auth.signInWithPassword({ email, password });
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
    console.error("Admin login failed", error);
    return {
      status: "error",
      message: "Unexpected error while contacting Supabase auth.",
    };
  }

  redirect("/dashboard/admin");
}

export async function userLoginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Enter workspace email and password." };
  }

  try {
    if (missingEnv()) {
      throw new Error("Supabase environment variables missing");
    }

    const authClient = createSupabaseAuthClient();
    const { error } = await authClient.auth.signInWithPassword({ email, password });
    if (error) {
      return { status: "error", message: error.message };
    }

    const supabase = getSupabaseServerClient();
    const { data, error: userError } = await supabase
      .from("cmms_users")
      .select("email,status")
      .eq("email", email)
      .eq("status", "active")
      .limit(1)
      .single();

    if (userError || !data) {
      return {
        status: "error",
        message: "No active CMMS user found for this email.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("cmms_user_email", email, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      path: "/",
    });
  } catch (error) {
    console.error("User login failed", error);
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
  cookieStore.delete("cmms_user_email");
  redirect("/login");
}
