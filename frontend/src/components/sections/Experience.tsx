"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getExperiences } from "@/lib/api";

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    getExperiences()
      .then((data) => setExperiences(data.results || data))
      .catch((err) => console.error("Error fetching experiences:", err));
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fa-IR", { year: "numeric", month: "short" });
  };

  return (
    <section id="experience" className="py-24 px-4 bg-[#0B1426]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            سوابق کاری
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] mx-auto rounded-full" />
        </div>

        <div className="relative">
          <div className="absolute right-4 md:right-1/2 top-0 bottom-0 w-px bg-[#1E3A5F] md:translate-x-1/2" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="absolute right-4 md:right-1/2 w-3 h-3 rounded-full bg-[#3B82F6] border-4 border-[#0B1426] md:translate-x-1/2 z-10 mt-1.5" />

                <div className="md:w-1/2 mr-12 md:mr-0">
                  <div className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {exp.title}
                      </h3>
                      {exp.is_current && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6]">
                          فعلی
                        </span>
                      )}
                    </div>
                    <p className="text-[#3B82F6] text-sm mb-1">{exp.company}</p>
                    <p className="text-[#94A3B8] text-xs mb-4">
                      {formatDate(exp.start_date)}
                      {" – "}
                      {exp.is_current ? "اکنون" : formatDate(exp.end_date || "")}
                    </p>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}