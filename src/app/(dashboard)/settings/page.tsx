import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your profile and account.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="font-medium">Profile</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="s-name" className="block text-sm font-medium">
              Full name
            </label>
            <input
              id="s-name"
              type="text"
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="s-email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="s-email"
              type="email"
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
              disabled
              placeholder="you@example.com"
            />
          </div>
          <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
