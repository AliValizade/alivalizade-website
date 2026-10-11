import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="border-t border-[#1E3A5F] bg-[#0B1426] py-8">
      <div className="max-w-6xl mx-auto px-4 text-center text-[#94A3B8] text-sm">
        <p dir="ltr">© 2026 Ali Valizade · PyVerse</p>
        <p className="mt-2">{t("builtWith")}</p>
      </div>
    </footer>
  );
}
