import { sendConfirmationEmail } from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, waitlistName, position, referralLink } =
      (await request.json()) as {
        email: string;
        waitlistName: string;
        position: number;
        referralLink: string;
      };

    const { error } = await sendConfirmationEmail({
      to: email,
      waitlistName,
      position,
      referralLink,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ data: null });
  } catch (err) {
    console.error("[POST /api/email/confirm]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
