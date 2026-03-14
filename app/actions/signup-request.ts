"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

export type WorkspaceRequestState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitWorkspaceRequest(
  _prev: WorkspaceRequestState,
  formData: FormData,
): Promise<WorkspaceRequestState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const plantsRaw = formData.get("plants");
  const plants =
    typeof plantsRaw === "string" && plantsRaw.length > 0
      ? Number(plantsRaw)
      : null;
  const goal = String(formData.get("goal") ?? "").trim();

  if (!fullName || !company || !email) {
    return { status: "error", message: "Name, company, and email are required." };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("workspace_requests").insert({
      full_name: fullName,
      company,
      email,
      plants: Number.isFinite(plants) ? plants : null,
      goal: goal || null,
    });

    if (error) {
      return { status: "error", message: error.message };
    }
  } catch (error) {
    console.error("Failed to submit workspace request", error);
    return {
      status: "error",
      message: "Could not talk to Supabase. Try again.",
    };
  }

  return {
    status: "success",
    message: "Request received. We'll provision your workspace within 24 hours.",
  };
}

export async function updateWorkspaceRequestStatus(formData: FormData) {
  const id = String(formData.get("requestId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !status) {
    return;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("workspace_requests")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Failed to update workspace request", error);
      return;
    }

    if (status === "approved" && data?.email) {
      try {
        const adminClient = getSupabaseAdminClient();
        await adminClient.auth.admin.inviteUserByEmail(data.email, {
          data: {
            company: data.company,
            source: "workspace-request",
          },
        });
      } catch (error) {
        console.error("Failed to invite user during approval", error);
      }
    }

    revalidatePath("/dashboard/requests");
    revalidatePath("/dashboard/admin");
  } catch (error) {
    console.error("Failed to update workspace request status", error);
  }
}
