import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "WaitlistPro — Launch with a waitlist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            background: "#10b981",
            borderRadius: 20,
            width: 96,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            fontWeight: 700,
            color: "white",
          }}
        >
          W
        </div>

        {/* Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{ fontSize: 64, fontWeight: 700, color: "white", letterSpacing: "-1px" }}
          >
            WaitlistPro
          </span>
          <span style={{ fontSize: 28, color: "#a1a1aa" }}>
            Launch with a waitlist
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
