"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { href: "#about", label: t("about") },
    { href: "#experience", label: t("experience") },
    { href: "#education", label: t("education") },
    { href: "#projects", label: t("projects") },
    { href: "#courses", label: t("courses") },
    { href: "#contact", label: t("contact") },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1426]/80 backdrop-blur-md border-b border-[#1E3A5F]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo - Left */}
          <Link href={`/${locale}`} className="flex items-center z-10">
            <Image
              src="/logo.png"
              alt="PyVerse"
              width={180}
              height={80}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu - Center */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Auth + Language */}
          <div className="hidden md:flex items-center gap-4 z-10">
            {/* Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#1E3A5F] hover:border-[#3B82F6]/50 text-sm text-[#F8FAFC] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
                    <User size={14} />
                  </div>
                  <span className="max-w-[100px] truncate">{user.username}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full mt-2 end-0 w-48 bg-[#111C33] border border-[#1E3A5F] rounded-xl shadow-xl overflow-hidden">
                    <Link
                      href={`/${locale}/panel`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[#94A3B8] hover:text-white hover:bg-[#0B1426] transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      {locale === "fa" ? "پنل کاربری" : "Dashboard"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#94A3B8] hover:text-red-400 hover:bg-[#0B1426] transition-colors"
                    >
                      <LogOut size={16} />
                      {locale === "fa" ? "خروج" : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="text-sm text-[#94A3B8] hover:text-white transition-colors"
              >
                {locale === "fa" ? "ورود" : "Login"}
              </Link>
            )}

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 text-sm border-s border-[#1E3A5F] ps-4">
              <Link
                href="/fa"
                className={cn(
                  "transition-all duration-200",
                  locale === "fa"
                    ? "opacity-100 scale-110"
                    : "opacity-40 hover:opacity-80"
                )}
                title="فارسی"
              >
                🇮🇷
              </Link>
              <span className="text-[#1E3A5F]">|</span>
              <Link
                href="/en"
                className={cn(
                  "transition-all duration-200",
                  locale === "en"
                    ? "opacity-100 scale-110"
                    : "opacity-40 hover:opacity-80"
                )}
                title="English"
              >
                🇺🇸
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#94A3B8] hover:text-white z-10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[500px] border-t border-[#1E3A5F]" : "max-h-0"
        )}
      >
        <nav
          className="flex flex-col px-4 py-4 gap-4 bg-[#0B1426]"
          dir={locale === "fa" ? "rtl" : "ltr"}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="text-[#94A3B8] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-[#1E3A5F] space-y-3">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={`/${locale}/panel`}
                  className="flex items-center gap-2 text-sm text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={16} />
                  {user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-red-400"
                >
                  <LogOut size={16} />
                  {locale === "fa" ? "خروج" : "Logout"}
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="text-sm text-[#3B82F6]"
                onClick={() => setIsOpen(false)}
              >
                {locale === "fa" ? "ورود / ثبت‌نام" : "Login / Register"}
              </Link>
            )}

            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/fa"
                className={cn(
                  "flex items-center gap-2 text-sm",
                  locale === "fa" ? "text-white" : "text-[#94A3B8]"
                )}
                onClick={() => setIsOpen(false)}
              >
                <span>🇮🇷</span>
                <span>فارسی</span>
              </Link>
              <Link
                href="/en"
                className={cn(
                  "flex items-center gap-2 text-sm",
                  locale === "en" ? "text-white" : "text-[#94A3B8]"
                )}
                onClick={() => setIsOpen(false)}
              >
                <span>🇺🇸</span>
                <span>English</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}