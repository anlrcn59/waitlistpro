import type { Plan } from "@/types";

// ─── Shopier ────────────────────────────────────────────────────────────────
export const SHOPIER_PRO_URL =
  "https://www.shopier.com/firsatrotasi/45535964";

// ─── Plan tanımları ──────────────────────────────────────────────────────────
export type PlanLimits = {
  waitlists: number | null; // null = sınırsız
  subscribers: number | null;
};

const LIMITS: Record<Plan, PlanLimits> = {
  free: { waitlists: 1, subscribers: 500 },
  pro: { waitlists: 5, subscribers: 10_000 },
  business: { waitlists: null, subscribers: null },
};

export const PLAN_NAMES: Record<Plan, string> = {
  free: "Ücretsiz",
  pro: "Pro",
  business: "Business",
};

/**
 * Verilen plan için limit bilgisini döner.
 * waitlists / subscribers null ise sınırsızdır.
 */
export function getPlanLimits(plan: Plan): PlanLimits {
  return LIMITS[plan];
}

/** Kullanıcı mevcut plan ile yeni waitlist oluşturabilir mi? */
export function canCreateWaitlist(plan: Plan, currentCount: number): boolean {
  const { waitlists } = getPlanLimits(plan);
  return waitlists === null || currentCount < waitlists;
}
