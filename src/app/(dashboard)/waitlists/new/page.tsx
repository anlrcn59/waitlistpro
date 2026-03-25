import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export const metadata: Metadata = { title: "New Waitlist" };

export default function NewWaitlistPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Waitlist
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Set up a new waitlist page for your product or launch.
        </p>
      </div>
      {/* TODO: wire onSubmit to POST /api/waitlists */}
      <WaitlistForm />
    </div>
  );
}
