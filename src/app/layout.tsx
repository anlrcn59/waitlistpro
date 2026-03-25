import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://waitlistpro.com";
const defaultDescription =
  "Create beautiful waitlist pages and grow your audience before you launch.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WaitlistPro — Launch with a waitlist",
    template: "%s | WaitlistPro",
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    siteName: "WaitlistPro",
    title: "WaitlistPro — Launch with a waitlist",
    description: defaultDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "WaitlistPro — Launch with a waitlist",
    description: defaultDescription,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
