import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

type Payload = {
  email?: string;
  password?: string;
  full_name?: string;
  role?: string;
  code?: string;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const fullName = (body.full_name ?? "").trim();
  const role = (body.role ?? "technician").trim() || "technician";
  const code = (body.code ?? "").trim();

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 },
    );
  }

  try {
    const requiredCode = process.env.CMMS_REGISTRATION_CODE;
    if (requiredCode && code !== requiredCode) {
      return NextResponse.json(
        { error: "Invalid registration code" },
        { status: 403 },
      );
    }

    let admin;
    try {
      admin = getSupabaseAdminClient();
    } catch (err: any) {
      return NextResponse.json(
        { error: err?.message ?? "Service role key misconfigured" },
        { status: 500 },
      );
    }

    // 1) create auth user
    const { data: userData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || undefined,
        role,
        source: "cmms-self-serve",
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 },
      );
    }

    // 2) add to cmms_users table
    const { error: tableError } = await admin.from("cmms_users").insert({
      email,
      full_name: fullName || null,
      role,
      status: "active",
    });

    if (tableError) {
      return NextResponse.json(
        {
          error: tableError.message,
          note: "Auth user created; cmms_users insert failed. Delete the auth user if needed.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      user_id: userData.user?.id,
      email,
      role,
    });
  } catch (error: any) {
    console.error("cmms-users POST failed", error);
    return NextResponse.json(
      { error: "Server error creating CMMS user" },
      { status: 500 },
    );
  }
}
