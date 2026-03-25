import { Resend } from "resend";
import { WelcomeEmail } from "./templates/welcome-email";
import { NotifyEmail } from "./templates/notify-email";

export const resend = new Resend(process.env["RESEND_API_KEY"]!);

// "Name <email>" formatında from adresi
const FROM_ADDRESS =
  `WaitlistPro <${process.env["RESEND_FROM_EMAIL"] ?? "noreply@waitlistpro.com"}>`;

export type SendResult = { error: string | null };

// ─────────────────────────────────────────────────────────────────────────────
// 1. Subscriber'a onay / hoşgeldin emaili
// ─────────────────────────────────────────────────────────────────────────────
export async function sendConfirmationEmail(params: {
  to: string;
  waitlistName: string;
  position: number;
  referralLink: string;
}): Promise<SendResult> {
  const { to, waitlistName, position, referralLink } = params;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Kaydın onaylandı! Sıradaki yerin: #${position}`,
    react: WelcomeEmail({ waitlistName, position, referralLink }),
  });

  return { error: error?.message ?? null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Waitlist sahibine yeni kayıt bildirimi
// ─────────────────────────────────────────────────────────────────────────────
export async function sendNewSubscriberNotification(params: {
  ownerEmail: string;
  waitlistName: string;
  subscriberEmail: string;
  position: number;
  totalSubscribers: number;
}): Promise<SendResult> {
  const { ownerEmail, waitlistName, subscriberEmail, position, totalSubscribers } =
    params;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: ownerEmail,
    subject: `Yeni kayıt: ${waitlistName} (toplam #${totalSubscribers})`,
    react: NotifyEmail({
      waitlistName,
      subscriberEmail,
      position,
      totalSubscribers,
    }),
  });

  return { error: error?.message ?? null };
}
