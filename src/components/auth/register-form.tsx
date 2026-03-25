"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n";

type RegisterDict = Dictionary["auth"]["register"];

function mapError(message: string, isEn: boolean): string {
  if (message.includes("User already registered"))
    return isEn ? "This email is already registered." : "Bu email adresi zaten kayıtlı.";
  if (message.includes("Password should be at least"))
    return isEn ? "Password must be at least 6 characters." : "Şifre en az 6 karakter olmalı.";
  if (message.includes("Unable to validate email address"))
    return isEn ? "Enter a valid email address." : "Geçerli bir email adresi gir.";
  if (message.includes("too many requests") || message.includes("security purposes"))
    return isEn ? "Too many attempts. Please wait." : "Çok fazla deneme. Lütfen biraz bekle.";
  return message;
}

type Props = { dict?: RegisterDict };

export function RegisterForm({ dict }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "tr";
  const isEn = lang === "en";

  const d = dict ?? {
    title: "Hesap Oluştur",
    subtitle: "Ücretsiz başla, istediğin zaman yükselt",
    full_name: "Ad Soyad",
    full_name_placeholder: "Ada Lovelace",
    email: "Email",
    email_placeholder: "ornek@email.com",
    password: "Şifre",
    password_hint: "En az 8 karakter",
    button: "Kayıt Ol",
    loading: "Hesap oluşturuluyor...",
    google: "Google ile kayıt ol",
    redirecting: "Yönlendiriliyor...",
    have_account: "Hesabın var mı?",
    sign_in_link: "Giriş yap",
    email_sent_title: "Emailini kontrol et",
    email_sent_desc: "adresine bir onay linki gönderdik.",
    email_spam: "Email gelmediyse spam klasörünü kontrol et.",
  };

  const loginHref = `/${lang}/login`;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(mapError(authError.message, isEn));
      setLoading(false);
      return;
    }

    if (data.user && !data.session) {
      setEmailSent(true);
      setLoading(false);
      return;
    }

    router.push(`/${lang}/dashboard`);
    router.refresh();
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (authError) {
      setError(mapError(authError.message, isEn));
      setGoogleLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-6">
        <div className="space-y-1 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            WaitlistPro
          </p>
        </div>
        <div className="rounded-xl border bg-card p-8 shadow-xs text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
            ✉
          </div>
          <h2 className="text-lg font-semibold">{d.email_sent_title}</h2>
          <p className="text-sm text-muted-foreground">
            <strong>{email}</strong> {d.email_sent_desc}
          </p>
          <p className="text-xs text-muted-foreground">{d.email_spam}</p>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {d.have_account}{" "}
          <Link
            href={loginHref}
            className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
          >
            {d.sign_in_link}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          WaitlistPro
        </p>
        <h1 className="text-2xl font-bold tracking-tight">{d.title}</h1>
        <p className="text-sm text-muted-foreground">{d.subtitle}</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
        >
          <GoogleIcon />
          {googleLoading ? d.redirecting : d.google}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">
              {isEn ? "or with email" : "veya email ile"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reg-name">{d.full_name}</Label>
            <Input
              id="reg-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={d.full_name_placeholder}
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-email">{d.email}</Label>
            <Input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={d.email_placeholder}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-password">{d.password}</Label>
            <Input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <p className="text-xs text-muted-foreground">{d.password_hint}</p>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading || googleLoading}>
            {loading ? d.loading : d.button}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {d.have_account}{" "}
        <Link
          href={loginHref}
          className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
        >
          {d.sign_in_link}
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
