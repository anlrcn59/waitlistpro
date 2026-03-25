import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLang } from "@/lib/i18n";
import { LangSwitcher } from "@/components/shared/lang-switcher";
import { DemoButton } from "@/components/shared/demo-button";
import { SHOPIER_PRO_URL } from "@/lib/plans";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  return {
    title: isEn
      ? "WaitlistPro — Launch Your Waitlist in 60 Seconds"
      : "WaitlistPro — Waitlist'ini 60 Saniyede Başlat",
    description: isEn
      ? "Create beautiful waitlist pages in minutes. Grow your audience before you launch with referral-powered growth."
      : "Dakikalar içinde güzel waitlist sayfaları oluştur. Referral büyümesiyle lansman öncesi kitlenizi oluşturun.",
  };
}

// ─── Mock screenshot ──────────────────────────────────────────────────────────

function MockScreenshot() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/60">
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
      <div className="flex flex-col items-center gap-6 px-8 py-12 sm:py-16">
        <div className="h-1 w-12 rounded-full bg-[#10b981]" />
        <div className="space-y-2 text-center">
          <div className="mx-auto h-8 w-56 rounded-lg bg-zinc-900" />
          <div className="mx-auto h-4 w-80 rounded bg-zinc-100" />
          <div className="mx-auto h-4 w-64 rounded bg-zinc-100" />
        </div>
        <div className="w-full max-w-sm space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 p-6">
          <div className="h-4 w-24 rounded bg-zinc-200" />
          <div className="h-10 w-full rounded-lg border border-zinc-200 bg-white" />
          <div className="h-10 w-full rounded-lg bg-[#10b981]" />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-[#10b981]" />
          <div className="h-3 w-40 rounded bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LandingPage({ params }: Props) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  const dict = getDictionary(lang);
  const l = dict.landing;
  const pf = l.pricing.features;

  const plans = [
    {
      key: "free" as const,
      price: "₺0",
      features: [pf.waitlists_1, pf.subs_500, pf.referral],
      missing: [pf.email_notifs, pf.csv_export, pf.priority_support],
      href: `/${lang}/register`,
      popular: false,
      external: false,
    },
    {
      key: "pro" as const,
      price: "₺99",
      features: [pf.waitlists_5, pf.subs_10k, pf.referral, pf.email_notifs, pf.csv_export, pf.custom_color],
      missing: [pf.priority_support],
      href: SHOPIER_PRO_URL,
      popular: true,
      external: true,
    },
    {
      key: "business" as const,
      price: "₺299",
      features: [pf.waitlists_unlimited, pf.subs_unlimited, pf.referral, pf.email_notifs, pf.csv_export, pf.custom_color, pf.priority_support],
      missing: [],
      href: "mailto:hello@waitlistpro.com",
      popular: false,
      external: false,
    },
  ];

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
            {l.nav.features}
          </a>
          <a href="#pricing" className="hidden text-sm text-zinc-500 hover:text-zinc-900 sm:block">
            {l.nav.pricing}
          </a>
          <LangSwitcher />
          <Link href={`/${lang}/login`} className="text-sm text-zinc-500 hover:text-zinc-900">
            {l.nav.sign_in}
          </Link>
          <Link
            href={`/${lang}/register`}
            className="rounded-md bg-[#10b981] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0d9668]"
          >
            {l.nav.start_free}
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        {/* ── Hero ── */}
        <section className="flex flex-col items-center px-4 pb-8 pt-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 px-3 py-1 text-xs font-medium text-[#10b981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            {l.hero.badge}
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {l.hero.title}{" "}
            <span className="text-[#10b981]">{l.hero.title_highlight}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-zinc-500">{l.hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${lang}/register`}
              className="rounded-lg bg-[#10b981] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d9668]"
            >
              {l.hero.cta_primary}
            </Link>
            <DemoButton label={l.hero.cta_secondary} />
          </div>
          <MockScreenshot />
        </section>

        {/* ── Features ── */}
        <section id="features" className="bg-zinc-50 px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">{l.features.title}</h2>
              <p className="mt-3 text-zinc-500">{l.features.subtitle}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {l.features.items.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#10b981]/10 text-xl">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it Works ── */}
        <section className="px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">{l.how_it_works.title}</h2>
              <p className="mt-3 text-zinc-500">{l.how_it_works.subtitle}</p>
            </div>
            <div className="relative grid gap-8 sm:grid-cols-3">
              <div className="absolute left-0 right-0 top-8 hidden h-px bg-zinc-100 sm:block" />
              {l.how_it_works.steps.map((s) => (
                <div key={s.number} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-100 bg-white text-xl font-bold text-[#10b981]">
                    {s.number}
                  </div>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="bg-zinc-50 px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">{l.pricing.title}</h2>
              <p className="mt-3 text-zinc-500">{l.pricing.subtitle}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {plans.map((plan) => {
                const planDict = l.pricing.plans[plan.key];
                return (
                  <div
                    key={plan.key}
                    className={`relative flex flex-col rounded-xl border bg-white p-8 ${
                      plan.popular
                        ? "border-2 border-[#10b981] shadow-lg shadow-[#10b981]/10"
                        : "border-zinc-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-[#10b981] px-3 py-1 text-xs font-semibold text-white">
                          {l.pricing.popular}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{planDict.name}</h3>
                      <p className="mt-0.5 text-xs text-zinc-500">{planDict.description}</p>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-sm text-zinc-500">{l.pricing.per_month}</span>
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
                        <li key={feat} className="flex items-center gap-2 text-zinc-300">
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
                        className="mt-8 block rounded-lg bg-[#10b981] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0d9668]"
                      >
                        {planDict.cta}
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
                        {planDict.cta}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-4 py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{l.cta.title}</h2>
            <p className="mt-4 text-zinc-500">{l.cta.subtitle}</p>
            <div className="mt-8 flex justify-center">
              <Link
                href={`/${lang}/register`}
                className="rounded-lg bg-[#10b981] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d9668]"
              >
                {l.cta.button}
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-400">{l.cta.note}</p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10b981] text-sm font-bold text-white">
                  W
                </div>
                <span className="font-semibold">WaitlistPro</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">{l.footer.tagline}</p>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {l.footer.product.label}
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#features" className="hover:text-zinc-900">{l.footer.product.features}</a></li>
                <li><a href="#pricing" className="hover:text-zinc-900">{l.footer.product.pricing}</a></li>
                <li><Link href={`/${lang}/register`} className="hover:text-zinc-900">{l.footer.product.get_started}</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {l.footer.account.label}
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href={`/${lang}/login`} className="hover:text-zinc-900">{l.footer.account.sign_in}</Link></li>
                <li><Link href={`/${lang}/register`} className="hover:text-zinc-900">{l.footer.account.sign_up}</Link></li>
                <li><Link href={`/${lang}/dashboard`} className="hover:text-zinc-900">{l.footer.account.dashboard}</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {l.footer.legal.label}
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/privacy" className="hover:text-zinc-900">{l.footer.legal.privacy}</Link></li>
                <li><Link href="/terms" className="hover:text-zinc-900">{l.footer.legal.terms}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-zinc-100 pt-6 text-center text-xs text-zinc-400">
            © {new Date().getFullYear()} WaitlistPro. {l.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
