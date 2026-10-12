"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getCourses } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";
import { BookOpen, Clock, ArrowLeft, Users } from "lucide-react";

interface Course {
  id: number;
  title: string;
  title_en?: string;
  short_description: string;
  short_description_en?: string;
  level: string;
  duration_hours: number;
  price: string | number;
  discount_price?: string | number | null;
  final_price?: string | number;
  has_discount?: boolean;
  is_featured: boolean;
  slug: string;
  total_students?: number;
}

export default function Courses() {
  const t = useTranslations("Courses");
  const locale = useLocale();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(data.results || data))
      .catch((err) => console.error("Error fetching courses:", err))
      .finally(() => setLoading(false));
  }, []);

  const levelMap: Record<string, string> = {
    beginner: t("beginner"),
    intermediate: t("intermediate"),
    advanced: t("advanced"),
  };

  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString(locale === "fa" ? "fa-IR" : "en-US");
  };

  return (
    <section id="courses" className="py-24 px-4 bg-[#0B1426]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] mx-auto rounded-full" />
          <p className="mt-4 text-[#94A3B8] max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[#94A3B8]">{t("loading")}</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-[#94A3B8]">
            {t("empty")}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col bg-[#111C33] border border-[#1E3A5F] rounded-2xl overflow-hidden hover:border-[#3B82F6]/50 transition-all duration-300"
              >
                <div className="h-1.5 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]" />

                <div className="p-6 flex flex-col flex-1">
                  {course.is_featured && (
                    <span className="self-start text-xs px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] mb-4">
                      {t("bestseller")}
                    </span>
                  )}

                  <h3 className="text-lg font-semibold text-white mb-3 leading-snug">
                    {locale === "en" ? (course.title_en || course.title) : course.title}
                  </h3>

                  <p className="text-[#94A3B8] text-sm leading-relaxed mb-5 flex-1">
                    {locale === "en" ? (course.short_description_en || course.short_description) : course.short_description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8] mb-5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={14} />
                      <span>{levelMap[course.level] || course.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>
                        {course.duration_hours} {locale === "fa" ? "ساعت" : "hours"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      <span>
                        {(course.total_students ?? 100).toLocaleString(
                          locale === "fa" ? "fa-IR" : "en-US"
                        )}{" "}
                        {locale === "fa" ? "دانشجو" : "students"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1E3A5F]">
                    <div>
                      {course.has_discount && course.discount_price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white">
                            {formatPrice(course.discount_price)}
                          </span>
                          <span className="text-sm text-[#94A3B8] line-through">
                            {formatPrice(course.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-white">
                          {formatPrice(course.price)}{" "}
                          <span className="text-sm font-normal text-[#94A3B8]">
                            {t("currency")}
                          </span>
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/${locale}/courses/${course.slug}`}
                      className="flex items-center gap-1.5 text-sm text-[#3B82F6] hover:text-white transition-colors font-medium"
                    >
                      <span>{locale === "fa" ? "مشاهده دوره" : "View Course"}</span>
                      <ArrowLeft size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}