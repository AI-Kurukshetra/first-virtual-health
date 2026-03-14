"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import {
  authInitialState,
  loginAction,
} from "@/app/actions/auth";

const authOptions = [
  { label: "Email & Password", description: "SSO-ready auth for admins & planners." },
  { label: "Magic Link", description: "Send a secure sign-in link to technicians." },
  { label: "Device Pair", description: "Pair mobile scanners via QR for hands-free logins." },
];

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-wait"
    >
      {pending ? "Checking credentials..." : "Continue"}
    </button>
  );
};

export const LoginCard = () => {
  const [state, formAction] = useFormState(loginAction, authInitialState);

  return (
    <div className="rounded-[32px] border border-white/15 bg-black/40 p-8 text-white shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
        <span>Sign in to command center</span>
        <span className="text-emerald-300">Secure</span>
      </div>
      <form className="mt-6 space-y-4" action={formAction}>
        <div>
          <label className="text-sm font-semibold text-white">Work email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="tech.ops@plant.com"
            className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-white">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="********"
            className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-white/60">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/40 bg-black/40 accent-emerald-400"
            />
            Remember this workstation
          </label>
          <button type="button" className="font-semibold text-emerald-300">
            Forgot?
          </button>
        </div>
        <SubmitButton />
        {state.status === "error" && (
          <p className="text-center text-sm text-rose-300">{state.message}</p>
        )}
      </form>
      <div className="mt-6 space-y-2 text-sm text-white/70">
        {authOptions.map((option) => (
          <div
            key={option.label}
            className="rounded-2xl border border-dashed border-white/20 px-4 py-3"
          >
            <p className="font-semibold">{option.label}</p>
            <p className="text-white/60">{option.description}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-white/60">
        Need workspace access?{" "}
        <Link href="/signup" className="font-semibold text-emerald-300">
          Request credentials
        </Link>
      </p>
    </div>
  );
};
