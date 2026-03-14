import { config } from "dotenv";

config({ path: ".env.local" });

const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!key) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is missing in .env.local");
  process.exit(1);
}

function decodeRole(jwt: string) {
  try {
    const [, payload] = jwt.split(".");
    const json = Buffer.from(payload, "base64").toString("utf8");
    const data = JSON.parse(json);
    return data.role ?? "(no role field)";
  } catch (error) {
    return `(decode error: ${(error as Error).message})`;
  }
}

const role = decodeRole(key);

console.log(`SUPABASE_SERVICE_ROLE_KEY role claim: ${role}`);
if (role !== "service_role") {
  console.log(
    "❌ This is not a service_role key. Copy the Service Role Key from Supabase Dashboard → Settings → API.",
  );
  process.exit(1);
}

console.log("✅ Looks like a valid service_role key.");
