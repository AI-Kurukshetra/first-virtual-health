"use client";

import { useState } from "react";

export const SignupCard = () => {
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("submitting");
    setTimeout(() => setState("done"), 1200);
  };

  return (
    <div className="rounded-[32px] border border-white/15 bg-white/5 p-8 text-white shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
        <span>Request workspace access</span>
        <span className="text-sky-300">Private beta</span>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Full name</label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="Avery Chen"
              className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Company</label>
            <input
              type="text"
              name="company"
              required
              placeholder="Falcon Ridge Manufacturing"
              className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Work email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="maintenance@company.com"
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              name="password"
              required
              className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Plant count</label>
            <input
              type="number"
              name="plants"
              min={1}
              placeholder="4"
              className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Primary goal</label>
          <textarea
            name="goal"
            rows={3}
            placeholder="Reduce downtime on CNC line 4 and automate preventive maintenance."
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <label className="inline-flex items-start gap-3 text-xs text-white/60">
          <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-white/30 bg-black/40 accent-sky-400" />
          I agree to the private beta terms, security review, and data processing described in the SRS.
        </label>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-wait"
        >
          {state === "submitting" ? "Submitting request..." : "Request access"}
        </button>
        {state === "done" && (
          <p className="text-center text-sm text-sky-300">
            Request received. Our team will provision your workspace within 24 hours.
          </p>
        )}
      </form>
    </div>
  );
};
