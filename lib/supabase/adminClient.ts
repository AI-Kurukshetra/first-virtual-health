import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isServiceRole(key: string) {
  try {
    const payload = JSON.parse(
      Buffer.from(key.split(".")[1] ?? "", "base64").toString("utf8"),
    );
    return payload?.role === "service_role";
  } catch {
    return false;
  }
}

export const getSupabaseAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Service role key missing. Set SUPABASE_SERVICE_ROLE_KEY to enable admin operations.",
    );
  }

  // Guard against misconfigured env (service role accidentally set to anon key).
  if (supabaseAnonKey && supabaseServiceRoleKey === supabaseAnonKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is set to the anon key. Replace it with the Service Role key from Supabase Settings > API.",
    );
  }

  if (!isServiceRole(supabaseServiceRoleKey)) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not a service_role key. Copy the Service Role key from Supabase Dashboard → Settings → API.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
