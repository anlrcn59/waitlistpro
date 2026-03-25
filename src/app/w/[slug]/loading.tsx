export default function PublicWaitlistLoading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      {/* Top bar placeholder */}
      <div className="fixed inset-x-0 top-0 h-1 animate-pulse bg-muted" />

      <div className="w-full max-w-md space-y-8">
        {/* Header skeleton */}
        <div className="flex flex-col items-center gap-3">
          <div className="animate-pulse h-8 w-56 rounded bg-muted" />
          <div className="animate-pulse h-4 w-72 rounded bg-muted" />
          <div className="animate-pulse h-1 w-12 rounded-full bg-muted" />
        </div>

        {/* Card skeleton */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="animate-pulse h-4 w-20 rounded bg-muted" />
          <div className="animate-pulse h-10 w-full rounded-md bg-muted" />
          <div className="animate-pulse h-10 w-full rounded-md bg-muted" />
        </div>

        <div className="animate-pulse h-3 w-32 rounded bg-muted mx-auto" />
      </div>
    </div>
  );
}
