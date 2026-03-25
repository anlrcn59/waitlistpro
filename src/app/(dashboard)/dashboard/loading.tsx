function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>
        <div className="h-5 w-14 rounded-full bg-muted" />
      </div>
      <div className="h-px bg-muted" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-3 w-16 rounded bg-muted" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="animate-pulse h-7 w-48 rounded bg-muted" />
          <div className="animate-pulse h-4 w-32 rounded bg-muted" />
        </div>
        <div className="animate-pulse h-8 w-28 rounded-md bg-muted" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
