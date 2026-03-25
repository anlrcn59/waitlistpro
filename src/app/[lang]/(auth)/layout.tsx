import { LangSwitcher } from "@/components/shared/lang-switcher";

export default function LangAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      {/* Lang switcher — top right */}
      <div className="absolute right-6 top-5">
        <LangSwitcher />
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
