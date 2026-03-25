import { resend, FROM_EMAIL } from "@/lib/resend";
import { NotifyEmail } from "@/lib/resend/templates/notify-email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { adminEmail, waitlistName, subscriberEmail, subscriberName, position, totalSubscribers } =
      (await request.json()) as {
        adminEmail: string;
        waitlistName: string;
        subscriberEmail: string;
        subscriberName?: string;
        position: number;
        totalSubscribers: number;
      };

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `New subscriber on ${waitlistName}`,
      react: NotifyEmail({
        waitlistName,
        subscriberEmail,
        subscriberName,
        position,
        totalSubscribers,
      }),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: null });
  } catch (err) {
    console.error("[POST /api/email/notify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
