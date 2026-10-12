"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { register } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await register(form);
      setAuth(data.user, data.access, data.refresh);
      router.push(`/${locale}/panel`);
    } catch (err: any) {
      const msg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.password1?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        (locale === "fa" ? "خطا در ثبت‌نام" : "Registration failed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          {locale === "fa" ? "ثبت‌نام" : "Register"}
        </h1>
        <p className="text-[#94A3B8] text-sm text-center mb-8">
          {locale === "fa"
            ? "حساب کاربری بسازید تا به دوره‌ها دسترسی داشته باشید"
            : "Create an account to access courses"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-[#94A3B8] mb-2">
              {locale === "fa" ? "نام کاربری" : "Username"}
            </label>
            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#0B1426] border border-[#1E3A5F] text-white focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-2">
              {locale === "fa" ? "ایمیل" : "Email"}
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-[#0B1426] border border-[#1E3A5F] text-white focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-2">
              {locale === "fa" ? "رمز عبور" : "Password"}
            </label>
            <input
              type="password"
              name="password1"
              required
              value={form.password1}
              onChange={handleChange}
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-[#0B1426] border border-[#1E3A5F] text-white focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-2">
              {locale === "fa" ? "تکرار رمز عبور" : "Confirm Password"}
            </label>
            <input
              type="password"
              name="password2"
              required
              value={form.password2}
              onChange={handleChange}
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-[#0B1426] border border-[#1E3A5F] text-white focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 text-white font-medium transition-all"
          >
            {loading
              ? locale === "fa"
                ? "در حال ثبت‌نام..."
                : "Registering..."
              : locale === "fa"
              ? "ثبت‌نام"
              : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-[#94A3B8] mt-6">
          {locale === "fa" ? "قبلاً ثبت‌نام کرده‌اید؟" : "Already have an account?"}{" "}
          <Link
            href={`/${locale}/login`}
            className="text-[#3B82F6] hover:underline"
          >
            {locale === "fa" ? "ورود" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}