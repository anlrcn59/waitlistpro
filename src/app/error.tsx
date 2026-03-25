"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Hata
      </p>
      <h1 className="text-2xl font-bold tracking-tight">
        Bir şeyler ters gitti
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Beklenmedik bir hata oluştu. Lütfen tekrar dene.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
      >
        Tekrar dene
      </button>
    </div>
  );
}
