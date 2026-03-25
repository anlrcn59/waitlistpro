import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLang, locales } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://waitlistpro.com";

  return {
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        tr: `${siteUrl}/tr`,
        en: `${siteUrl}/en`,
      },
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  return <>{children}</>;
}
