"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  joinWaitlist,
  waitlistInitialState,
} from "@/app/actions/join-waitlist";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
      disabled={pending}
    >
      {pending ? "Adding..." : "Join the waitlist"}
    </button>
  );
};

export const WaitlistForm = () => {
  const [state, formAction] = useActionState(joinWaitlist, waitlistInitialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/50">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="dev@company.com"
          className="w-full rounded-xl border border-zinc-300/80 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner outline-none transition focus:border-black focus:ring-2 focus:ring-black/20 dark:border-white/20 dark:bg-black/40 dark:text-white dark:placeholder:text-zinc-400"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="useCase" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          What are you launching?
        </label>
        <textarea
          id="useCase"
          name="useCase"
          rows={3}
          placeholder="Describe the Supabase-powered experience you want to deploy on Vercel."
          className="w-full resize-none rounded-xl border border-zinc-300/80 bg-white px-3 py-2 text-sm text-zinc-900 shadow-inner outline-none transition focus:border-black focus:ring-2 focus:ring-black/20 dark:border-white/20 dark:bg-black/40 dark:text-white dark:placeholder:text-zinc-400"
        />
      </div>

      <SubmitButton />

      {state.status !== "idle" && (
        <p
          className={`text-sm ${state.status === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-rose-400"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
};
