import type { Metadata } from "next";
import { PricingTable } from "@/components/billing/pricing-table";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your subscription and plan.
        </p>
      </div>
      <PricingTable />
    </div>
  );
}
