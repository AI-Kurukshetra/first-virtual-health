"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthFormState = {
  status: "idle" | "error";
  message?: string;
};

export const authInitialState: AuthFormState = {
  status: "idle",
  message: "",
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
    const supabase = createServerActionClient({ cookies });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { status: "error", message: error.message };
    }
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
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signOut();
  redirect("/login");
}
