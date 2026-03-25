export type WelcomeEmailProps = {
  waitlistName: string;
  position: number;
  referralLink: string;
};

export function WelcomeEmail({
  waitlistName,
  position,
  referralLink,
}: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        You&apos;re on the waitlist!
      </h1>
      <p>
        You joined <strong>{waitlistName}</strong> and you&apos;re{" "}
        <strong>#{position}</strong> in line.
      </p>
      <p>Share your referral link to move up faster:</p>
      <a
        href={referralLink}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          background: "#18181b",
          color: "#fff",
          borderRadius: 6,
          textDecoration: "none",
        }}
      >
        Share my link
      </a>
      <p style={{ marginTop: 24, fontSize: 12, color: "#71717a" }}>
        {referralLink}
      </p>
    </div>
  );
}
