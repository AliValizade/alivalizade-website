"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { BookOpen, Clock, ArrowLeft, Play } from "lucide-react";
import { getCourseBySlug, enrollInCourse } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Lesson {
  id: number;
  title: string;
  title_en?: string;
  order: number;
  duration_minutes: number;
  is_preview: boolean;
}

interface Course {
  id: number;
  title: string;
  title_en?: string;
  slug: string;
  short_description: string;
  short_description_en?: string;
  description: string;
  description_en?: string;
  price: string | number;
  discount_price?: string | number | null;
  final_price?: string | number;
  has_discount?: boolean;
  level: string;
  duration_hours: number;
  is_featured: boolean;
  lessons: Lesson[];
  lessons_count: number;
}

export default function CourseDetailPage() {
  // ===== همه Hookها باید اینجا باشند (قبل از هر return) =====
  const params = useParams();
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState("");

  useEffect(() => {
    if (!slug) return;

    getCourseBySlug(slug)
      .then((data) => setCourse(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // ===== توابع =====
  const levelMap: Record<string, string> = {
    beginner: locale === "fa" ? "مبتدی" : "Beginner",
    intermediate: locale === "fa" ? "متوسط" : "Intermediate",
    advanced: locale === "fa" ? "پیشرفته" : "Advanced",
  };

  const formatPrice = (price: string | number) =>
    Number(price).toLocaleString(locale === "fa" ? "fa-IR" : "en-US");

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }
    if (!course) return;

    setEnrolling(true);
    setEnrollMsg("");
    try {
      await enrollInCourse(course.id);
      setEnrollMsg(
        locale === "fa"
          ? "ثبت‌نام با موفقیت انجام شد. (در انتظار پرداخت)"
          : "Enrolled successfully. (Pending payment)"
      );
    } catch (err: any) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.course_id?.[0] ||
        (locale === "fa" ? "خطا در ثبت‌نام" : "Enrollment failed");
      setEnrollMsg(String(detail));
    } finally {
      setEnrolling(false);
    }
  };

  // ===== returnهای شرطی بعد از Hookها =====
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#94A3B8]">
        {locale === "fa" ? "در حال بارگذاری..." : "Loading..."}
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[#94A3B8]">
          {locale === "fa" ? "دوره یافت نشد." : "Course not found."}
        </p>
        <Link
          href={`/${locale}#courses`}
          className="text-[#3B82F6] hover:underline text-sm"
        >
          {locale === "fa" ? "بازگشت به دوره‌ها" : "Back to courses"}
        </Link>
      </div>
    );
  }

  const title =
    locale === "en" && course.title_en ? course.title_en : course.title;
  const shortDesc =
    locale === "en" && course.short_description_en
      ? course.short_description_en
      : course.short_description;
  const description =
    locale === "en" && course.description_en
      ? course.description_en
      : course.description;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Link
        href={`/${locale}#courses`}
        className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white mb-10 transition-colors"
      >
        <ArrowLeft size={16} />
        {locale === "fa" ? "بازگشت به دوره‌ها" : "Back to courses"}
      </Link>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            {course.is_featured && (
              <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] mb-4">
                {locale === "fa" ? "پرفروش" : "Bestseller"}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-snug">
              {title}
            </h1>
            <p className="text-[#94A3B8] text-lg leading-relaxed">{shortDesc}</p>
          </div>

          {description && (
            <div className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-3">
                {locale === "fa" ? "توضیحات دوره" : "Course Description"}
              </h2>
              <p className="text-[#94A3B8] leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          <div className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-5">
              {locale === "fa" ? "سرفصل‌ها" : "Curriculum"}{" "}
              <span className="text-[#94A3B8] font-normal text-sm">
                ({course.lessons_count} {locale === "fa" ? "درس" : "lessons"})
              </span>
            </h2>

            <div className="space-y-3">
              {course.lessons?.length > 0 ? (
                course.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#0B1426] border border-[#1E3A5F]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center text-[#94A3B8]">
                        <Play size={14} />
                      </div>
                      <div>
                        <p className="text-white text-sm">
                          {locale === "en" && lesson.title_en
                            ? lesson.title_en
                            : lesson.title}
                        </p>
                        {lesson.is_preview && (
                          <span className="text-xs text-[#3B82F6]">
                            {locale === "fa" ? "پیش‌نمایش رایگان" : "Free preview"}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-[#94A3B8] whitespace-nowrap">
                      {lesson.duration_minutes}{" "}
                      {locale === "fa" ? "دقیقه" : "min"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[#94A3B8] text-sm">
                  {locale === "fa"
                    ? "سرفصل‌ها به زودی اضافه می‌شوند."
                    : "Curriculum coming soon."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6 space-y-5">
            <div>
              {course.has_discount && course.discount_price ? (
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">
                    {formatPrice(course.discount_price)}{" "}
                    <span className="text-sm font-normal text-[#94A3B8]">
                      {locale === "fa" ? "تومان" : "IRR"}
                    </span>
                  </p>
                  <p className="text-sm text-[#94A3B8] line-through">
                    {formatPrice(course.price)}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-white">
                  {formatPrice(course.price)}{" "}
                  <span className="text-sm font-normal text-[#94A3B8]">
                    {locale === "fa" ? "تومان" : "IRR"}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <BookOpen size={16} />
                <span>{levelMap[course.level] || course.level}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>
                  {course.duration_hours}{" "}
                  {locale === "fa" ? "ساعت" : "hours"}
                </span>
              </div>
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="block w-full text-center py-3.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              {enrolling
                ? locale === "fa"
                  ? "در حال ثبت‌نام..."
                  : "Enrolling..."
                : locale === "fa"
                ? "ثبت‌نام در دوره"
                : "Enroll Now"}
            </button>

            {enrollMsg && (
              <p className="text-xs text-center text-[#94A3B8]">{enrollMsg}</p>
            )}

            <p className="text-xs text-center text-[#64748B]">
              {locale === "fa"
                ? "پس از ثبت‌نام، دسترسی از طریق پنل کاربری فعال می‌شود."
                : "Access will be available in your panel after enrollment."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}