export type NotifyEmailProps = {
  waitlistName: string;
  subscriberEmail: string;
  subscriberName?: string;
  position: number;
  totalSubscribers: number;
};

export function NotifyEmail({
  waitlistName,
  subscriberEmail,
  subscriberName,
  position,
  totalSubscribers,
}: NotifyEmailProps) {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>
        New subscriber on {waitlistName}
      </h1>
      <p>
        <strong>{subscriberName ?? subscriberEmail}</strong> joined at position{" "}
        <strong>#{position}</strong>.
      </p>
      <p style={{ color: "#71717a" }}>
        Total subscribers: <strong>{totalSubscribers}</strong>
      </p>
    </div>
  );
}
