"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { getMyEnrollments } from "@/lib/api";
import { LogOut, User, BookOpen, Mail } from "lucide-react";

interface Enrollment {
  id: number;
  status: string;
  amount_paid: string | number;
  enrolled_at: string;
  course: {
    id: number;
    title: string;
    title_en?: string;
    slug: string;
    short_description?: string;
    short_description_en?: string;
  };
}

export default function PanelPage() {
  const locale = useLocale();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
      return;
    }

    getMyEnrollments()
      .then((data) => setEnrollments(data.results || data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, locale, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#94A3B8]">
        {locale === "fa" ? "در حال انتقال..." : "Redirecting..."}
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  const statusLabel = (status: string) => {
    const map: Record<string, { fa: string; en: string; color: string }> = {
      pending: {
        fa: "در انتظار پرداخت",
        en: "Pending payment",
        color: "text-yellow-400 bg-yellow-400/10",
      },
      completed: {
        fa: "فعال",
        en: "Active",
        color: "text-green-400 bg-green-400/10",
      },
      cancelled: {
        fa: "لغو شده",
        en: "Cancelled",
        color: "text-red-400 bg-red-400/10",
      },
      refunded: {
        fa: "بازپرداخت",
        en: "Refunded",
        color: "text-gray-400 bg-gray-400/10",
      },
    };
    const item = map[status] || map.pending;
    return {
      label: locale === "fa" ? item.fa : item.en,
      color: item.color,
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {locale === "fa" ? "پنل کاربری" : "User Panel"}
          </h1>
          <p className="text-[#94A3B8] text-sm">
            {locale === "fa"
              ? "خوش آمدید، مدیریت حساب و دوره‌های شما"
              : "Welcome, manage your account and courses"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1E3A5F] text-[#94A3B8] hover:text-white hover:border-red-500/50 transition-colors text-sm"
        >
          <LogOut size={16} />
          {locale === "fa" ? "خروج" : "Logout"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Profile */}
        <div className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
              <User size={22} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {locale === "fa" ? "اطلاعات حساب" : "Account Info"}
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[#64748B] mb-1">
                {locale === "fa" ? "نام کاربری" : "Username"}
              </p>
              <p className="text-white">{user.username}</p>
            </div>
            <div>
              <p className="text-[#64748B] mb-1">
                {locale === "fa" ? "ایمیل" : "Email"}
              </p>
              <p className="text-white flex items-center gap-2">
                <Mail size={14} className="text-[#94A3B8]" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
              <BookOpen size={22} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {locale === "fa" ? "خلاصه دوره‌ها" : "Courses Summary"}
            </h2>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {loading ? "..." : enrollments.length}
          </p>
          <p className="text-[#94A3B8] text-sm">
            {locale === "fa" ? "دوره ثبت‌نام‌شده" : "Enrolled courses"}
          </p>
        </div>
      </div>

      {/* Enrollments list */}
      <div className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">
          {locale === "fa" ? "دوره‌های من" : "My Courses"}
        </h2>

        {loading ? (
          <p className="text-[#94A3B8] text-sm">
            {locale === "fa" ? "در حال بارگذاری..." : "Loading..."}
          </p>
        ) : enrollments.length === 0 ? (
          <div>
            <p className="text-[#94A3B8] text-sm mb-4">
              {locale === "fa"
                ? "هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید."
                : "You haven't enrolled in any courses yet."}
            </p>
            <Link
              href={`/${locale}#courses`}
              className="text-sm text-[#3B82F6] hover:text-white transition-colors"
            >
              {locale === "fa" ? "مشاهده دوره‌ها" : "Browse Courses"}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((item) => {
              const status = statusLabel(item.status);
              const courseTitle =
                locale === "en" && item.course.title_en
                  ? item.course.title_en
                  : item.course.title;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-[#0B1426] border border-[#1E3A5F]"
                >
                  <div>
                    <Link
                      href={`/${locale}/courses/${item.course.slug}`}
                      className="text-white font-medium hover:text-[#3B82F6] transition-colors"
                    >
                      {courseTitle}
                    </Link>
                    <p className="text-xs text-[#64748B] mt-1">
                      {new Date(item.enrolled_at).toLocaleDateString(
                        locale === "fa" ? "fa-IR" : "en-US"
                      )}
                    </p>
                  </div>
                  <span
                    className={`self-start text-xs px-2.5 py-1 rounded-full ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}