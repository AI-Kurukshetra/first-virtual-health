"use client";

import { useState } from "react";

type Status = "idle" | "success" | "error" | "pending";

export function AdminRegisterCard() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const full_name = String(formData.get("full_name") ?? "").trim();
    const role = String(formData.get("role") ?? "admin").trim() || "admin";
    const codeInput = String(formData.get("code") ?? "").trim();
    const code = codeInput.replace(/^ADMIN_REGISTRATION_CODE=/i, "").trim();

    if (!email || !password) {
      setStatus("error");
      setMessage("Email and password are required.");
      return;
    }

    setStatus("pending");
    setMessage("");

    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name, role, code }),
      });

      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Could not create admin user.");
        return;
      }

      setStatus("success");
      setMessage("Admin user created. You can sign in now.");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  };

  return (
    <div className="rounded-[32px] border border-white/15 bg-white/5 p-8 text-white shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
        <span>Create admin user</span>
        <span className="text-indigo-300">Service role</span>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold">Full name</label>
          <input
            type="text"
            name="full_name"
            placeholder="Ops Admin"
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Admin email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="admin@plant.com"
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Strong password"
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Role</label>
          <select
            name="role"
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            defaultValue="admin"
          >
            <option value="admin">Admin</option>
            <option value="approver">Approver</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">Admin registration code</label>
          <input
            type="text"
            name="code"
            required
            placeholder={process.env.ADMIN_REGISTRATION_CODE || "Provided by super-admin"}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button
          type="submit"
          disabled={status === "pending"}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-400 via-blue-500 to-emerald-400 px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-wait"
        >
          {status === "pending" ? "Creating admin..." : "Create admin user"}
        </button>
        {status === "success" && (
          <p className="text-center text-sm text-indigo-200">{message}</p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-rose-300">{message}</p>
        )}
      </form>
      <p className="mt-4 text-xs text-white/60">
        Uses <code>/api/admin-users</code> with the service role key and an admin registration code
        (<code>ADMIN_REGISTRATION_CODE</code> or fallback to <code>CMMS_REGISTRATION_CODE</code>).
      </p>
    </div>
  );
}
