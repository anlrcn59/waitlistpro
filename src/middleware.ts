import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { locales, isValidLang } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

const DEFAULT_LANG: Lang = "tr";

// Paths that don't require auth and are open to anyone
function isPublicPath(pathname: string): boolean {
  // Landing, auth pages, waitlist public pages, API routes
  return (
    /^\/(?:tr|en)\/?$/.test(pathname) ||
    /^\/(?:tr|en)\/(login|register)/.test(pathname) ||
    pathname.startsWith("/w/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.svg" ||
    pathname === "/favicon.ico"
  );
}

function isAuthPath(pathname: string): boolean {
  return /^\/(?:tr|en)\/(login|register)/.test(pathname);
}

function isDashboardPath(pathname: string): boolean {
  return /^\/(?:tr|en)\//.test(pathname) && !isPublicPath(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Root redirect: / → /tr (or saved preference) ─────────────────────
  if (pathname === "/") {
    const savedLang = request.cookies.get("lang")?.value;
    const lang: Lang =
      savedLang && isValidLang(savedLang) ? savedLang : DEFAULT_LANG;
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}`;
    return NextResponse.redirect(url);
  }

  // ── 2. Legacy route redirects (/login → /tr/login etc.) ──────────────────
  const legacyMap: Record<string, string> = {
    "/login": "/tr/login",
    "/register": "/tr/register",
    "/dashboard": "/tr/dashboard",
  };
  if (legacyMap[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = legacyMap[pathname] ?? pathname;
    return NextResponse.redirect(url);
  }

  // ── 3. Unknown [lang] segment → redirect to default ──────────────────────
  const langSegment = pathname.split("/")[1];
  if (
    langSegment &&
    !isValidLang(langSegment) &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/") &&
    !pathname.startsWith("/w/") &&
    langSegment !== "favicon.svg" &&
    langSegment !== "favicon.ico"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LANG}${pathname}`;
    return NextResponse.redirect(url);
  }

  // ── 4. Supabase session refresh ───────────────────────────────────────────
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentLang: Lang = isValidLang(langSegment ?? "") ? (langSegment as Lang) : DEFAULT_LANG;

  // ── 5. Set lang cookie (persists preference) ──────────────────────────────
  if (locales.includes(currentLang)) {
    response.cookies.set("lang", currentLang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  // ── 6. Auth guard ─────────────────────────────────────────────────────────
  // Authenticated users on auth pages → dashboard
  if (user && isAuthPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${currentLang}/dashboard`;
    return NextResponse.redirect(url);
  }

  // Unauthenticated users on protected pages → login
  if (!user && isDashboardPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${currentLang}/login`;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
