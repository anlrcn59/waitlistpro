import Link from "next/link";
import type { Waitlist } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

type Props = {
  waitlist: Waitlist;
  subscriberCount: number;
};

export function WaitlistCard({ waitlist, subscriberCount }: Props) {
  return (
    <Link
      href={`/waitlists/${waitlist.id}`}
      className="group block focus-visible:outline-none"
    >
      <Card className="h-full transition-all group-hover:ring-foreground/25 group-focus-visible:ring-ring">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="truncate">{waitlist.name}</CardTitle>
            <Badge
              variant={waitlist.is_active ? "default" : "secondary"}
              className="shrink-0"
            >
              {waitlist.is_active ? "Aktif" : "Duraklatıldı"}
            </Badge>
          </div>
          <CardDescription className="font-mono text-xs">
            /w/{waitlist.slug}
          </CardDescription>
        </CardHeader>

        {waitlist.description && (
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {waitlist.description}
            </p>
          </CardContent>
        )}

        <CardFooter className="justify-between text-xs text-muted-foreground">
          <span>
            <strong className="text-sm font-semibold text-foreground">
              {formatNumber(subscriberCount)}
            </strong>{" "}
            abone
          </span>
          <span>
            {new Date(waitlist.created_at).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
