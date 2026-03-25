import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="text-2xl font-bold tracking-tight">Sayfa bulunamadı</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Aradığın sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm font-medium underline underline-offset-4 hover:text-foreground/80"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}
