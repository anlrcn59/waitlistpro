import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { DemoButton } from "@/components/shared/demo-button";

export const metadata: Metadata = {
  title: "WaitlistPro — Launch with a waitlist",
  description:
    "Create beautiful waitlist pages in minutes. Grow your audience before you launch with referral-powered growth.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <span className="font-semibold tracking-tight">WaitlistPro</span>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Launch with a waitlist
          </h1>
          <p className="max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
            Create beautiful waitlist pages in minutes. Grow your audience
            before you launch with referral-powered growth.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
          >
            Start for free
          </Link>
          <DemoButton />
        </div>
      </main>

      <Footer />
    </div>
  );
}
