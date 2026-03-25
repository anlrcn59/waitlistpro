"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCopy } from "@/hooks/use-copy";
import type { Subscriber, SubscriberStatus } from "@/types";

const PAGE_SIZE = 20;
type SortField = "position" | "email" | "status" | "created_at";

const STATUS_CONFIG: Record<
  SubscriberStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  waiting: { label: "Bekliyor", variant: "outline" },
  confirmed: { label: "Onaylı", variant: "default" },
  invited: { label: "Davet Edildi", variant: "secondary" },
};

type Props = {
  waitlistId: string;
  waitlistName: string;
  publicLink: string;
  subscribers: Subscriber[];
};

export function WaitlistDetailClient({
  waitlistId,
  waitlistName,
  publicLink,
  subscribers,
}: Props) {
  const router = useRouter();
  const { copied, copy } = useCopy();

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("position");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ── Derived ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = q
      ? subscribers.filter(
          (s) =>
            s.email.toLowerCase().includes(q) ||
            s.referral_code.toLowerCase().includes(q),
        )
      : [...subscribers];

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "position") cmp = a.position - b.position;
      else if (sortField === "email") cmp = a.email.localeCompare(b.email);
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      else cmp = a.created_at.localeCompare(b.created_at);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [subscribers, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function exportCSV() {
    const header = ["Pozisyon", "Email", "Durum", "Referral Kodu", "Katılım Tarihi"];
    const rows = subscribers.map((s) => [
      String(s.position),
      `"${s.email}"`,
      s.status,
      s.referral_code,
      new Date(s.created_at).toLocaleDateString("tr-TR"),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${waitlistName.replace(/\s+/g, "-").toLowerCase()}-subscribers.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");
    const res = await fetch(`/api/waitlists/${waitlistId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const json = (await res.json()) as { error?: string };
      setDeleteError(json.error ?? "Bir hata oluştu.");
      setDeleting(false);
    }
  }

  // ── Sort indicator ───────────────────────────────────────────────────────
  function sortIcon(field: SortField) {
    if (sortField !== field) return <span className="ml-1 text-muted-foreground">↕</span>;
    return (
      <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Email veya referral kodu ara..."
          className="h-8 w-full max-w-xs rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 sm:max-w-64"
        />

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => copy(publicLink)}>
            {copied ? "Kopyalandı!" : "Link Kopyala"}
          </Button>
          <Button size="sm" variant="outline" onClick={exportCSV}>
            CSV Export
          </Button>

          <Dialog
            open={deleteOpen}
            onOpenChange={(open) => {
              setDeleteOpen(open);
              if (!open) setDeleteError("");
            }}
          >
            <DialogTrigger
              render={<Button size="sm" variant="destructive" />}
            >
              Waitlist Sil
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Waitlist&apos;i sil</DialogTitle>
                <DialogDescription>
                  <strong>&quot;{waitlistName}&quot;</strong> waitlist&apos;i ve tüm
                  subscriber verileri kalıcı olarak silinecek. Bu işlem geri alınamaz.
                </DialogDescription>
              </DialogHeader>
              {deleteError && (
                <p className="text-sm text-destructive">{deleteError}</p>
              )}
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Vazgeç
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Siliniyor..." : "Evet, sil"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-16 cursor-pointer select-none"
                onClick={() => handleSort("position")}
              >
                # {sortIcon("position")}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("email")}
              >
                Email {sortIcon("email")}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                Durum {sortIcon("status")}
              </TableHead>
              <TableHead>Referral Kodu</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("created_at")}
              >
                Kayıt Tarihi {sortIcon("created_at")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  {search ? "Arama sonucu bulunamadı." : "Henüz subscriber yok."}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((sub) => {
                const status = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.waiting;
                return (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.position}</TableCell>
                    <TableCell>{sub.email}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {sub.referral_code}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(sub.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filtered.length} sonuçtan {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, filtered.length)} gösteriliyor
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Önceki
            </Button>
            <span className="px-2">
              {page + 1} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Sonraki →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
