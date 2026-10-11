"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSkills } from "@/lib/api";

interface Skill {
  id: number;
  name: string;
  name_en?: string;
  level: string;
  category?: string;
}

export default function About() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getSkills()
      .then((data) => setSkills(data.results || data))
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  const levelMap: Record<string, string> = {
    advanced: "پیشرفته",
    intermediate: "متوسط",
    beginner: "مبتدی",
  };

  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            درباره من
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              علی ولی‌زاده هستم
            </h3>
            <div className="space-y-4 text-[#94A3B8] leading-relaxed">
              <p>
                برنامه‌نویس پایتون و جنگو با بیش از ۴ سال تجربه عملی در توسعه
                بک‌اند، ربات‌های تلگرام، اتوماسیون و سیستم‌های مبتنی بر داده.
              </p>
              <p>
                در حال حاضر کارشناس ارشد هوش مصنوعی و رباتیک هستم و به
                عنوان مدرس دانشگاه فعالیت می‌کنم. علاقه‌مند به کدنویسی تمیز،
                معماری مقیاس‌پذیر و تبدیل ایده‌ها به سیستم‌های واقعی و قابل
                نگهداری.
              </p>
              <p>
                تجربه کار با Django، PostgreSQL، Machine Learning و ابزارهای
                اتوماسیون را دارم و همیشه به دنبال یادگیری و ساخت محصولات مفید
                هستم.
              </p>
            </div>
          </motion.div>

          {/* Skills from API */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">مهارت‌ها</h3>
            <div className="flex flex-wrap gap-3">
              {skills.length === 0 ? (
                <p className="text-[#94A3B8] text-sm">در حال بارگذاری...</p>
              ) : (
                skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="px-4 py-2 rounded-xl bg-[#111C33] border border-[#1E3A5F] text-sm text-[#F8FAFC] hover:border-[#3B82F6] transition-colors duration-200"
                  >
                    <span>{skill.name}</span>
                    <span className="text-[#94A3B8] text-xs mr-2">
                      {" "}
                      · {levelMap[skill.level] || skill.level}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}