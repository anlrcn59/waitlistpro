import type { Metadata } from "next";
import Link from "next/link";
import { DemoButton } from "@/components/shared/demo-button";

export const metadata: Metadata = {
  title: "WaitlistPro — Launch Your Waitlist in 60 Seconds",
  description:
    "Create beautiful waitlist pages in minutes. Grow your audience before you launch with referral-powered growth.",
};

// ─── Mock screenshot ──────────────────────────────────────────────────────────

function MockScreenshot() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/60">
      {/* Browser bar */}
      <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-zinc-200 text-xs text-zinc-500">
          waitlistpro.com/w/my-startup
        </div>
      </div>

      {/* Page content mockup */}
      <div className="flex flex-col items-center gap-6 px-8 py-12 sm:py-16">
        {/* Color bar */}
        <div className="h-1 w-12 rounded-full bg-[#10b981]" />

        <div className="space-y-2 text-center">
          <div className="h-8 w-56 rounded-lg bg-zinc-900 mx-auto" />
          <div className="h-4 w-80 rounded bg-zinc-100 mx-auto" />
          <div className="h-4 w-64 rounded bg-zinc-100 mx-auto" />
        </div>

        {/* Form mock */}
        <div className="w-full max-w-sm space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 p-6">
          <div className="h-4 w-24 rounded bg-zinc-200" />
          <div className="h-10 w-full rounded-lg border border-zinc-200 bg-white" />
          <div className="h-10 w-full rounded-lg bg-[#10b981]" />
        </div>

        {/* Position badge mock */}
        <div className="flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-[#10b981]" />
          <div className="h-3 w-40 rounded bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const features = [
  {
    icon: "✉",
    title: "Email Collection",
    description:
      "Capture emails from day one with a beautiful, branded waitlist page. No design skills required.",
  },
  {
    icon: "🔗",
    title: "Referral System",
    description:
      "Built-in viral loops. Every subscriber gets a unique link that moves them up the queue when shared.",
  },
  {
    icon: "📍",
    title: "Real-time Position",
    description:
      "Subscribers see their live position on the waitlist — a powerful motivator that drives sharing.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description:
      "Track signups, referrals, and growth over time. Export your list as CSV at any point.",
  },
];

// ─── Steps ────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Create",
    description:
      "Set up your waitlist in under a minute. Pick a name, slug, and accent colour.",
  },
  {
    number: "02",
    title: "Share",
    description:
      "Share your unique /w/your-slug link everywhere — Twitter, email, Product Hunt.",
  },
  {
    number: "03",
    title: "Grow",
    description:
      "Watch subscribers pour in and move themselves up via referrals before you even launch.",
  },
];

// ─── Pricing ──────────────────────────────────────────────────────────────────

const plans = [
  {
    name: "Free",
    price: "₺0",
    description: "Perfect to get started",
    features: [
      "1 waitlist",
      "500 subscribers",
      "Referral system",
      "Public waitlist page",
    ],
    missing: ["Email notifications", "CSV export", "Priority support"],
    cta: "Start Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "₺99",
    description: "For growing products",
    features: [
      "5 waitlists",
      "10,000 subscribers",
      "Referral system",
      "Email notifications",
      "CSV export",
      "Custom accent colour",
    ],
    missing: ["Priority support"],
    cta: "Get Pro",
    href: "https://www.shopier.com/firsatrotasi/45535964",
    popular: true,
    external: true,
  },
  {
    name: "Business",
    price: "₺299",
    description: "For teams & agencies",
    features: [
      "Unlimited waitlists",
      "Unlimited subscribers",
      "Referral system",
      "Email notifications",
      "CSV export",
      "Custom accent colour",
      "Priority support",
    ],
    missing: [],
    cta: "Contact Us",
    href: "mailto:hello@waitlistpro.com",
    popular: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-100 bg-white/90 px-6 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10b981] text-sm font-bold text-white">
            W
          </div>
          <span className="font-semibold tracking-tight">WaitlistPro</span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-3">
          <a href="#features" className="hidden text-sm text-zinc-500 hover:text-zinc-900 sm:block">
            Features
          </a>
          <a href="#pricing" className="hidden text-sm text-zinc-500 hover:text-zinc-900 sm:block">
            Pricing
          </a>
          <Link
            href="/login"
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-[#10b981] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0d9668]"
          >
            Start Free
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        {/* ── Hero ── */}
        <section className="flex flex-col items-center px-4 pb-8 pt-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 px-3 py-1 text-xs font-medium text-[#10b981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            Free to start — no credit card required
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Launch Your Waitlist{" "}
            <span className="text-[#10b981]">in 60 Seconds</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-zinc-500">
            Build hype before you launch. Collect emails, power viral growth
            with referrals, and ship to a warm audience.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-[#10b981] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d9668]"
            >
              Start Free →
            </Link>
            <DemoButton />
          </div>

          <MockScreenshot />
        </section>

        {/* ── Features ── */}
        <section id="features" className="bg-zinc-50 px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to launch
              </h2>
              <p className="mt-3 text-zinc-500">
                Built for indie hackers and startup founders who move fast.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#10b981]/10 text-xl">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it Works ── */}
        <section className="px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                How it works
              </h2>
              <p className="mt-3 text-zinc-500">Three steps to launch day.</p>
            </div>

            <div className="relative grid gap-8 sm:grid-cols-3">
              {/* Connecting line (desktop) */}
              <div className="absolute left-0 right-0 top-8 hidden h-px bg-zinc-100 sm:block" />

              {steps.map((s) => (
                <div key={s.number} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-100 bg-white text-xl font-bold text-[#10b981]">
                    {s.number}
                  </div>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="bg-zinc-50 px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Simple, honest pricing
              </h2>
              <p className="mt-3 text-zinc-500">
                Start free. Upgrade when you need more.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-xl border bg-white p-8 ${
                    plan.popular
                      ? "border-2 border-[#10b981] shadow-lg shadow-[#10b981]/10"
                      : "border-zinc-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-[#10b981] px-3 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {plan.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-sm text-zinc-500">/mo</span>
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <span className="text-[#10b981]">✓</span>
                        {feat}
                      </li>
                    ))}
                    {plan.missing.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-2 text-zinc-300"
                      >
                        <span>—</span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {plan.external ? (
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-8 block rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                        plan.popular
                          ? "bg-[#10b981] text-white hover:bg-[#0d9668]"
                          : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {plan.cta}
                    </a>
                  ) : (
                    <Link
                      href={plan.href}
                      className={`mt-8 block rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                        plan.popular
                          ? "bg-[#10b981] text-white hover:bg-[#0d9668]"
                          : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-4 py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build your waitlist?
            </h2>
            <p className="mt-4 text-zinc-500">
              Join hundreds of founders already using WaitlistPro to validate
              ideas and build pre-launch momentum.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="w-full rounded-lg bg-[#10b981] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d9668] sm:w-auto"
              >
                Start Free — No credit card needed
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-400">
              Setup in 60 seconds. Cancel anytime.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10b981] text-sm font-bold text-white">
                  W
                </div>
                <span className="font-semibold">WaitlistPro</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                Launch with confidence. Build your audience before day one.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Product
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <a href="#features" className="hover:text-zinc-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-zinc-900">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/register" className="hover:text-zinc-900">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Account
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <Link href="/login" className="hover:text-zinc-900">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-zinc-900">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-zinc-900">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Legal
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <Link href="/privacy" className="hover:text-zinc-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-zinc-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-zinc-100 pt-6 text-center text-xs text-zinc-400">
            © {new Date().getFullYear()} WaitlistPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
