import { PLANS } from "@/lib/stripe/plans";
import { UpgradeButton } from "./upgrade-button";

export function PricingTable() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Object.values(PLANS).map((plan) => (
        <div
          key={plan.id}
          className={`rounded-lg border p-6 ${
            plan.id === "pro" ? "border-zinc-900 dark:border-zinc-100" : ""
          }`}
        >
          <h3 className="font-semibold">{plan.name}</h3>
          <p className="mt-2 text-3xl font-bold">
            {plan.price.monthly === 0
              ? "Free"
              : `$${plan.price.monthly / 100}`}
            {plan.price.monthly > 0 && (
              <span className="text-base font-normal text-zinc-500">/mo</span>
            )}
          </p>

          <ul className="mt-4 space-y-2 text-sm">
            <li>
              {plan.limits.waitlists === null
                ? "Unlimited"
                : plan.limits.waitlists}{" "}
              waitlist{plan.limits.waitlists !== 1 ? "s" : ""}
            </li>
            <li>
              {plan.limits.subscribers === null
                ? "Unlimited"
                : plan.limits.subscribers.toLocaleString()}{" "}
              subscribers
            </li>
            {plan.limits.referral && <li>✓ Referral system</li>}
            {plan.limits.emailNotifications && <li>✓ Email notifications</li>}
            {plan.limits.customDomain && <li>✓ Custom domain</li>}
            {plan.limits.removeBranding && <li>✓ Remove branding</li>}
          </ul>

          {plan.id !== "free" && (
            <UpgradeButton plan={plan.id} className="mt-6 w-full" />
          )}
        </div>
      ))}
    </div>
  );
}
