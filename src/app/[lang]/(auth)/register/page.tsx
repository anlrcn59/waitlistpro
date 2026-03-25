import type { Metadata } from "next";
import { getDictionary, isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "tr" ? "Kayıt Ol — WaitlistPro" : "Sign Up — WaitlistPro",
  };
}

export default async function LangRegisterPage({ params }: Props) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  const dict = getDictionary(lang);

  return <RegisterForm dict={dict.auth.register} />;
}
