"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { userLoginAction, type AuthFormState } from "@/app/actions/auth";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-wait"
    >
      {pending ? "Authenticating..." : "Sign in to workspace"}
    </button>
  );
};

const initialState: AuthFormState = { status: "idle", message: "" };

export function CmmsLoginCard() {
  const [state, formAction] = useActionState(userLoginAction, initialState);

  return (
    <div className="rounded-[32px] border border-white/15 bg-black/30 p-8 text-white shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
        <span>Workspace access</span>
        <span className="text-emerald-200">Technicians</span>
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
        <p className="text-xs text-white/60">
          Validates against <code>cmms_users</code> table entries marked{" "}
          <span className="font-semibold text-white">active</span>.
        </p>
        <SubmitButton />
        {state.status === "error" && (
          <p className="text-center text-sm text-rose-300">{state.message}</p>
        )}
      </form>
    </div>
  );
}
