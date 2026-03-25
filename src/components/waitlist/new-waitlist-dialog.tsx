"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateSlug } from "@/lib/utils";
import { createWaitlistSchema } from "@/lib/validations";
import { SHOPIER_PRO_URL } from "@/lib/plans";

type FieldErrors = Partial<
  Record<"name" | "slug" | "description" | "color", string>
>;

type Props = {
  disabled?: boolean;
  triggerLabel?: string;
};

export function NewWaitlistDialog({
  disabled = false,
  triggerLabel = "+ Yeni Waitlist",
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#10b981");
  const [slugEdited, setSlugEdited] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auto-generate slug from name until the user manually edits it
  useEffect(() => {
    if (!slugEdited) {
      setSlug(generateSlug(name));
    }
  }, [name, slugEdited]);

  function handleSlugChange(raw: string) {
    setSlugEdited(true);
    setSlug(raw.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  }

  function resetForm() {
    setName("");
    setSlug("");
    setDescription("");
    setColor("#10b981");
    setSlugEdited(false);
    setFieldErrors({});
    setServerError("");
    setSubmitting(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    setOpen(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");

    const parsed = createWaitlistSchema.safeParse({
      name,
      slug,
      description: description || undefined,
      color,
    });

    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const [key, msgs] of Object.entries(
        parsed.error.flatten().fieldErrors,
      )) {
        const first = msgs?.[0];
        if (first) fe[key as keyof FieldErrors] = first;
      }
      setFieldErrors(fe);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as { error?: string; field?: string };

      if (!res.ok) {
        if (res.status === 409) {
          setFieldErrors({ slug: json.error ?? "Bu slug zaten kullanımda." });
        } else if (res.status === 403) {
          setServerError("__plan_limit__");
        } else {
          setServerError(json.error ?? "Bir hata oluştu.");
        }
        return;
      }

      handleOpenChange(false);
      router.refresh();
    } catch {
      setServerError("Bağlantı hatası. Tekrar dene.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => handleOpenChange(next)}>
      <DialogTrigger render={<Button size="sm" disabled={disabled} />}>
        {triggerLabel}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yeni Waitlist Oluştur</DialogTitle>
            <DialogDescription>
              Waitlist bilgilerini gir. Slug oluşturulduktan sonra
              değiştirilemez.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="wl-name">
                İsim <span className="text-destructive">*</span>
              </Label>
              <Input
                id="wl-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Product Launch"
                autoFocus
                autoComplete="off"
              />
              {fieldErrors.name && (
                <p className="text-xs text-destructive">{fieldErrors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="wl-slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-1.5">
                <span className="shrink-0 text-sm text-muted-foreground">
                  /w/
                </span>
                <Input
                  id="wl-slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="product-launch"
                  className="font-mono text-sm"
                />
              </div>
              {fieldErrors.slug ? (
                <p className="text-xs text-destructive">{fieldErrors.slug}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Sadece küçük harf, rakam ve tire.
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="wl-desc">
                Açıklama{" "}
                <span className="text-xs text-muted-foreground">
                  (opsiyonel)
                </span>
              </Label>
              <textarea
                id="wl-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Waitlist hakkında kısa bir açıklama..."
                rows={2}
                className="flex min-h-[60px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {fieldErrors.description && (
                <p className="text-xs text-destructive">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <Label htmlFor="wl-color">
                Tema Rengi{" "}
                <span className="text-xs text-muted-foreground">
                  (opsiyonel)
                </span>
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="wl-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-10 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#10b981"
                  className="w-28 font-mono text-sm"
                  maxLength={7}
                />
                <div
                  className="h-9 w-9 shrink-0 rounded-md border border-input"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
              </div>
              {fieldErrors.color && (
                <p className="text-xs text-destructive">{fieldErrors.color}</p>
              )}
            </div>

            {serverError && serverError !== "__plan_limit__" && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
            {serverError === "__plan_limit__" && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                Plan limitine ulaştın.{" "}
                <a
                  href={SHOPIER_PRO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline underline-offset-2"
                >
                  Pro&apos;ya Geç →
                </a>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Vazgeç
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
