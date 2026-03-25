import Stripe from "stripe";

export const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"]!, {
  apiVersion: "2026-02-25.clover",
  appInfo: { name: "WaitlistPro", version: "0.1.0" },
});

export function getURL(path = ""): string {
  let url =
    process.env["NEXT_PUBLIC_SITE_URL"] ??
    process.env["NEXT_PUBLIC_VERCEL_URL"] ??
    "http://localhost:3000";
  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  path = path.startsWith("/") ? path.slice(1) : path;
  return `${url}${path}`;
}
