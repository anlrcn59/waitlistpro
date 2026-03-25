"use client";

import { useState } from "react";
import { generateSlug } from "@/lib/utils";
import type { CreateWaitlistInput } from "@/lib/validations";

type Props = {
  defaultValues?: Partial<CreateWaitlistInput>;
  onSubmit?: (data: CreateWaitlistInput) => Promise<void>;
  submitLabel?: string;
};

export function WaitlistForm({
  defaultValues,
  onSubmit,
  submitLabel = "Create Waitlist",
}: Props) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [description, setDescription] = useState(
    defaultValues?.description ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    if (!defaultValues?.slug) setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit?.({ name, slug, description: description || undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="wl-name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="wl-name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="My Product Launch"
          className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          required
        />
      </div>
      <div>
        <label htmlFor="wl-slug" className="block text-sm font-medium">
          Slug
        </label>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-zinc-500">waitlistpro.com/w/</span>
          <input
            id="wl-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-product"
            className="block flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            pattern="[a-z0-9\-]+"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="wl-description" className="block text-sm font-medium">
          Description{" "}
          <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          id="wl-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
      >
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
