import type { Metadata } from "next";

export const metadata: Metadata = { title: "Waitlist" };

export default async function WaitlistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Waitlist</h1>
        <span className="font-mono text-xs text-zinc-400">{id}</span>
      </div>
      <p className="text-sm text-zinc-500">
        Waitlist settings and details go here.
      </p>
    </div>
  );
}
