"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Courses from "@/components/sections/Courses";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1426] via-[#111C33] to-[#0B1426]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#3B82F6] via-[#8B5CF6] to-[#3B82F6] opacity-80 blur-[2px]" />
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-[#0B1426] shadow-2xl shadow-blue-500/20">
                <img
                  src="/profile.jpg"
                  alt={t("name")}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <p className="text-[#3B82F6] text-sm md:text-base font-medium mb-4 tracking-wide">
            {t("role")}
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {t("name")}
          </h1>

          <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}#courses`}
              className="px-8 py-3.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              {t("coursesBtn")}
            </Link>

            <Link
              href={`/${locale}#projects`}
              className="px-8 py-3.5 rounded-xl border border-[#1E3A5F] hover:border-[#3B82F6] text-[#F8FAFC] font-medium transition-all duration-200"
            >
              {t("projectsBtn")}
            </Link>
          </div>
        </div>
      </section>

      <About />
      <Experience />
      <Education />
      <Projects />
      <Courses />
      <Contact />
    </>
  );
}