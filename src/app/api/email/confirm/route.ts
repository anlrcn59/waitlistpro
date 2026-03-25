import { resend, FROM_EMAIL } from "@/lib/resend";
import { WelcomeEmail } from "@/lib/resend/templates/welcome-email";
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

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You're on the ${waitlistName} waitlist!`,
      react: WelcomeEmail({ waitlistName, position, referralLink }),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: null });
  } catch (err) {
    console.error("[POST /api/email/confirm]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
