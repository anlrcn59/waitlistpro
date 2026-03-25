type Props = {
  title: string;
  value: string | number;
  description?: string;
};

export function StatsCard({ title, value, description }: Props) {
  return (
    <div className="rounded-lg border bg-white p-5 dark:bg-zinc-950">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-zinc-400">{description}</p>
      )}
    </div>
  );
}
