"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { getEducations } from "@/lib/api";

interface EducationItem {
  id: number;
  degree: string;
  degree_en?: string;
  institution: string;
  institution_en?: string;
  field?: string;
  field_en?: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description?: string;
  description_en?: string;
}

export default function Education() {
  const locale = useLocale();
  const [educations, setEducations] = useState<EducationItem[]>([]);

  useEffect(() => {
    getEducations()
      .then((data) => setEducations(data.results || data))
      .catch((err) => console.error("Error fetching educations:", err));
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
      year: "numeric",
    });
  };

  if (educations.length === 0) return null;

  return (
    <section id="education" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {locale === "fa" ? "تحصیلات" : "Education"}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] mx-auto rounded-full" />
        </div>

        <div className="space-y-6">
          {educations.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {locale === "en" && edu.degree_en ? edu.degree_en : edu.degree}
                  {(locale === "en" ? edu.field_en : edu.field)
                    ? ` – ${locale === "en" ? edu.field_en : edu.field}`
                    : ""}
                </h3>
                {edu.is_current && (
                  <span className="self-start text-xs px-2.5 py-1 rounded-full bg-[#3B82F6]/20 text-[#3B82F6]">
                    {locale === "fa" ? "در حال تحصیل" : "In Progress"}
                  </span>
                )}
              </div>

              <p className="text-[#3B82F6] text-sm mb-1">
                {locale === "en" && edu.institution_en
                  ? edu.institution_en
                  : edu.institution}
              </p>
              <p className="text-[#94A3B8] text-xs mb-3">
                {formatDate(edu.start_date)}
                {" – "}
                {edu.is_current
                  ? locale === "fa"
                    ? "اکنون"
                    : "Present"
                  : formatDate(edu.end_date || "")}
              </p>

              {(locale === "en" ? edu.description_en : edu.description) && (
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  {locale === "en" ? edu.description_en : edu.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}