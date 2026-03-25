import { sendNewSubscriberNotification } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ownerEmail, waitlistName, subscriberEmail, position, totalSubscribers } =
      (await request.json()) as {
        ownerEmail: string;
        waitlistName: string;
        subscriberEmail: string;
        position: number;
        totalSubscribers: number;
      };

    const { error } = await sendNewSubscriberNotification({
      ownerEmail,
      waitlistName,
      subscriberEmail,
      position,
      totalSubscribers,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ data: null });
  } catch (err) {
    console.error("[POST /api/email/notify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
