"use client";

import { useState } from "react";
import { ReferralLink } from "./referral-link";

type Props = {
  waitlistId: string;
  waitlistName: string;
  accentColor: string;
  referralCode?: string;
};

type State = "idle" | "loading" | "success" | "error";

export function SignupForm({
  waitlistId,
  waitlistName,
  accentColor,
  referralCode,
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [referralLink, setReferralLink] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waitlist_id: waitlistId,
          email,
          referral_code: referralCode,
        }),
      });

      const json = (await res.json()) as {
        data?: { position: number; referral_link: string };
        error?: string;
      };

      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong.");
        setState("error");
        return;
      }

      setPosition(json.data?.position ?? null);
      setReferralLink(json.data?.referral_link ?? "");
      setState("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white"
            style={{ backgroundColor: accentColor }}
          >
            ✓
          </div>
          <h2 className="text-xl font-semibold tracking-tight">
            You&apos;re on the list!
          </h2>
          {position !== null && (
            <p className="text-sm text-zinc-500">
              You are{" "}
              <strong className="font-semibold text-zinc-900">
                #{position}
              </strong>{" "}
              on the {waitlistName} waitlist.
            </p>
          )}
        </div>

        {referralLink && (
          <div className="space-y-2 rounded-lg border bg-zinc-50 p-4 text-left dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Move up the list
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Share your personal link — each referral bumps you higher.
            </p>
            <ReferralLink link={referralLink} accentColor={accentColor} />
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="block w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
          required
          autoComplete="email"
        />
      </div>

      {state === "error" && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: accentColor }}
      >
        {state === "loading" ? "Joining…" : "Join the waitlist"}
      </button>
    </form>
  );
}
