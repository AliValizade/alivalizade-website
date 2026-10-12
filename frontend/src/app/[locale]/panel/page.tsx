"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { LogOut, User, BookOpen, Mail } from "lucide-react";

export default function PanelPage() {
  const locale = useLocale();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
    }
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Card */}
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
            {(user.first_name || user.last_name) && (
              <div>
                <p className="text-[#64748B] mb-1">
                  {locale === "fa" ? "نام" : "Name"}
                </p>
                <p className="text-white">
                  {user.first_name} {user.last_name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Courses Card */}
        <div className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
              <BookOpen size={22} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {locale === "fa" ? "دوره‌های من" : "My Courses"}
            </h2>
          </div>

          <p className="text-[#94A3B8] text-sm mb-6">
            {locale === "fa"
              ? "هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید."
              : "You haven't enrolled in any courses yet."}
          </p>

          <Link
            href={`/${locale}#courses`}
            className="inline-flex items-center gap-2 text-sm text-[#3B82F6] hover:text-white transition-colors"
          >
            {locale === "fa" ? "مشاهده دوره‌ها" : "Browse Courses"}
          </Link>
        </div>
      </div>
    </div>
  );
}