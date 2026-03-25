import { redirect } from "next/navigation";

// Root / is handled by middleware (redirects to /tr or /en based on lang cookie).
// This fallback covers edge cases where middleware doesn't run.
export default function RootPage() {
  redirect("/tr");
}
