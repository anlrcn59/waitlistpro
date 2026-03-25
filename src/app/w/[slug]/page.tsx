import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWaitlistBySlug } from "@/lib/supabase/queries";
import { SignupForm } from "@/components/waitlist/signup-form";
import type { WaitlistSettings } from "@/types/database";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getWaitlistBySlug(slug);
  if (!data) return { title: "Waitlist Not Found" };
  return {
    title: `Join ${data.name}`,
    description: data.description ?? `Sign up for the ${data.name} waitlist.`,
  };
}

export default async function PublicWaitlistPage({ params, searchParams }: Props) {
  const [{ slug }, { ref }] = await Promise.all([params, searchParams]);

  const { data: waitlist } = await getWaitlistBySlug(slug);
  if (!waitlist) notFound();

  const settings = waitlist.settings as WaitlistSettings;
  const accentColor = settings.color ?? "#18181b";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      {/* Colored top bar */}
      <div
        className="fixed inset-x-0 top-0 h-1"
        style={{ backgroundColor: accentColor }}
      />

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          {settings.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={waitlist.name}
              className="mx-auto h-12 w-auto object-contain"
            />
          )}
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {waitlist.name}
          </h1>
          {waitlist.description && (
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              {waitlist.description}
            </p>
          )}
          <div
            className="mx-auto h-1 w-12 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <SignupForm
            waitlistId={waitlist.id}
            waitlistName={waitlist.name}
            accentColor={accentColor}
            referralCode={ref}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400">
          Powered by{" "}
          <span className="font-medium text-zinc-500">WaitlistPro</span>
        </p>
      </div>
    </div>
  );
}
