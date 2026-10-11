"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#contact", label: "تماس" },
  { href: "#courses", label: "دوره‌ها" },
  { href: "#projects", label: "پروژه‌ها" },
  { href: "#education", label: "تحصیلات" },
  { href: "#experience", label: "سوابق" },
  { href: "#about", label: "درباره من" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header dir="ltr" className="fixed top-0 left-0 right-0 z-50 bg-[#0B1426]/80 backdrop-blur-md border-b border-[#1E3A5F]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="PyVerse"
              width={200}
              height={80}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu - Right */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#94A3B8] hover:text-white"
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
          isOpen ? "max-h-64 border-t border-[#1E3A5F]" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-4 py-4 gap-4 bg-[#0B1426]" dir="rtl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#94A3B8] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}