"use client";

import { SHOPIER_PRO_URL } from "@/lib/plans";

export function PricingTable() {
  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border-2 border-zinc-900 bg-card p-8 shadow-sm dark:border-zinc-100">
        {/* Plan header */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Pro</h3>
          <p className="text-sm text-muted-foreground">
            Büyüyen projeler için
          </p>
        </div>

        {/* Price */}
        <div className="mt-4">
          <span className="text-4xl font-bold">₺299</span>
          <span className="text-base font-normal text-muted-foreground">
            /ay
          </span>
        </div>

        {/* Features */}
        <ul className="mt-6 space-y-3 text-sm">
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            5 waitlist
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            10.000 subscriber
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            Referral sistemi
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            Email bildirimleri
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            Özel tema rengi
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            CSV export
          </li>
        </ul>

        {/* CTA */}
        <button
          type="button"
          onClick={() => {
            window.location.href = SHOPIER_PRO_URL;
          }}
          className="mt-8 w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Pro&apos;ya Geç
        </button>
      </div>
    </div>
  );
}
