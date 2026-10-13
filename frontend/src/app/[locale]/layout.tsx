import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist, Vazirmatn } from "next/font/google";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "../globals.css";
import type { Metadata } from "next";


const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFa = locale === "fa";

  const title = isFa
    ? "علی ولی‌زاده | PyVerse — توسعه‌دهنده پایتون و هوش مصنوعی"
    : "Ali Valizade | PyVerse — Python Developer & AI";

  const description = isFa
    ? "توسعه‌دهنده پایتون و جنگو، مدرس و متخصص اتوماسیون و هوش مصنوعی. رزومه، پروژه‌ها و دوره‌های آموزشی."
    : "Python & Django developer, instructor, automation and AI specialist. Portfolio, projects, and courses.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: isFa ? "fa_IR" : "en_US",
      type: "website",
      siteName: "PyVerse",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      languages: {
        fa: "/fa",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <body
        className={`${
          locale === "fa" ? vazirmatn.className : geist.className
        } antialiased bg-[#0B1426] text-[#F8FAFC]`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}