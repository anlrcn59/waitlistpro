import type { Metadata } from "next";
import { SubscriberTable } from "@/components/waitlist/subscriber-table";

export const metadata: Metadata = { title: "Subscribers" };

export default async function SubscribersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: fetch subscribers from DB
  void id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Subscribers</h1>
      </div>
      <SubscriberTable subscribers={[]} />
    </div>
  );
}
