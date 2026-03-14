"use server";

import {
  getSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/serverClient";

export type WaitlistFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const waitlistInitialState: WaitlistFormState = {
  status: "idle",
  message: "",
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export async function joinWaitlist(
  _prevState: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const useCase = String(formData.get("useCase") ?? "").trim();

  if (!isValidEmail(email)) {
    return {
      status: "error",
      message: "Add a valid email so we can send deployment updates.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "Supabase is not configured yet. Populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("waitlist").insert({
      email,
      use_case: useCase || null,
      source: "nextjs-starter",
    });

    if (error) {
      return {
        status: "error",
        message: `Supabase error: ${error.message}`,
      };
    }

    return {
      status: "success",
      message: "You're on the list — watch your inbox for Vercel deploy notes.",
    };
  } catch (error) {
    console.error("Failed to reach Supabase", error);
    return {
      status: "error",
      message: "Could not talk to Supabase. Double-check your credentials.",
    };
  }
}

