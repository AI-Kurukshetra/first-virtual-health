import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cachedClient: SupabaseClient | null = null;

const resolveAuthKey = () => supabaseServiceRoleKey ?? supabaseAnonKey ?? "";

export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey));

export const getSupabaseServerClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase environment variables are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (and optionally SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl!, resolveAuthKey(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
};

export const getSupabaseEnvironmentDetails = () => ({
  url: supabaseUrl ?? "",
  hasServiceRoleKey: Boolean(supabaseServiceRoleKey),
});

