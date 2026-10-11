"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { getExperiences } from "@/lib/api";

interface ExperienceItem {
  id: number;
  title: string;
  title_en?: string;
  company: string;
  company_en?: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description: string;
  description_en?: string;
}

export default function Experience() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const isRtl = locale === "fa";
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    getExperiences()
      .then((data) => setExperiences(data.results || data))
      .catch((err) => console.error("Error fetching experiences:", err));
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRtl ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section id="experience" className="py-24 px-4 bg-[#0B1426]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isRtl ? "سوابق کاری" : "Work Experience"}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] mx-auto rounded-full" />
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-colors duration-300"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {locale === "en" && exp.title_en ? exp.title_en : exp.title}
                </h3>
                {exp.is_current && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6]">
                    {t("current")}
                  </span>
                )}
              </div>

              <p className="text-[#3B82F6] text-sm mb-1">
                {locale === "en" && exp.company_en ? exp.company_en : exp.company}
              </p>

              <p className="text-[#94A3B8] text-xs mb-4">
                {formatDate(exp.start_date)}
                {" – "}
                {exp.is_current
                  ? isRtl
                    ? "اکنون"
                    : "Present"
                  : formatDate(exp.end_date || "")}
              </p>

              <p className="text-[#94A3B8] text-sm leading-relaxed">
                {locale === "en" && exp.description_en
                  ? exp.description_en
                  : exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}