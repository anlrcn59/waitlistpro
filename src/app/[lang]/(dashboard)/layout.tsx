import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LangDashboardLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
