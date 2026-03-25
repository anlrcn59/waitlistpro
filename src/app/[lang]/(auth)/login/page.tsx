import type { Metadata } from "next";
import { getDictionary, isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "tr" ? "Giriş Yap — WaitlistPro" : "Sign In — WaitlistPro",
  };
}

export default async function LangLoginPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  const { error } = await searchParams;
  const dict = getDictionary(lang);

  return <LoginForm urlError={error} dict={dict.auth.login} />;
}
