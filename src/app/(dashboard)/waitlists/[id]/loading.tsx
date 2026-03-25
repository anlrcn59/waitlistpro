function StatSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-card p-4 space-y-2">
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="h-7 w-16 rounded bg-muted" />
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b">
      <div className="animate-pulse h-3 w-6 rounded bg-muted" />
      <div className="animate-pulse h-3 flex-1 rounded bg-muted" />
      <div className="animate-pulse h-5 w-16 rounded-full bg-muted" />
      <div className="animate-pulse h-3 w-20 rounded bg-muted" />
    </div>
  );
}

export default function WaitlistDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="animate-pulse h-7 w-48 rounded bg-muted" />
          <div className="animate-pulse h-4 w-64 rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="animate-pulse h-8 w-24 rounded-md bg-muted" />
          <div className="animate-pulse h-8 w-20 rounded-md bg-muted" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="animate-pulse h-8 w-48 rounded-md bg-muted" />
          <div className="animate-pulse h-8 w-28 rounded-md bg-muted" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
