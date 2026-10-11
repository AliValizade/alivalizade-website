"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { login } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    username: "",
    password: "",
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
      const data = await login(form);
      setAuth(data.user, data.access, data.refresh);
      router.push(`/${locale}/panel`);
    } catch (err: any) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          (locale === "fa" ? "نام کاربری یا رمز عبور اشتباه است" : "Invalid credentials")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          {locale === "fa" ? "ورود" : "Login"}
        </h1>
        <p className="text-[#94A3B8] text-sm text-center mb-8">
          {locale === "fa"
            ? "وارد حساب کاربری خود شوید"
            : "Sign in to your account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-[#94A3B8] mb-2">
              {locale === "fa" ? "نام کاربری یا ایمیل" : "Username or Email"}
            </label>
            <input
              type="text"
              name="username"
              required
              value={form.username}
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
              name="password"
              required
              value={form.password}
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
                ? "در حال ورود..."
                : "Signing in..."
              : locale === "fa"
              ? "ورود"
              : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-[#94A3B8] mt-6">
          {locale === "fa" ? "حساب ندارید؟" : "Don't have an account?"}{" "}
          <Link
            href={`/${locale}/register`}
            className="text-[#3B82F6] hover:underline"
          >
            {locale === "fa" ? "ثبت‌نام" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}