"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Hata
      </p>
      <h1 className="text-xl font-bold tracking-tight">Bir şeyler ters gitti</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Bu sayfa yüklenirken beklenmedik bir hata oluştu.
      </p>
      <button
        onClick={reset}
        className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
      >
        Tekrar dene
      </button>
    </div>
  );
}
