"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/api";
import { useTranslations } from "next-intl";

export default function Contact() {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/contact/", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          t("error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4">
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

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#111C33] border border-[#1E3A5F] flex items-center justify-center text-[#3B82F6]">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">{t("email")}</h4>
                <a
                  href="mailto:alivalizade@gmail.com"
                  className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors text-sm"
                >
                  alivalizade@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#111C33] border border-[#1E3A5F] flex items-center justify-center text-[#3B82F6]">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">{t("phone")}</h4>
                <a
                  href="tel:+989155772159"
                  className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors text-sm"
                  dir="ltr"
                >
                  +98 915 577 2159
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#111C33] border border-[#1E3A5F] flex items-center justify-center text-[#3B82F6]">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">{t("location")}</h4>
                <p className="text-[#94A3B8] text-sm">{t("city")}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6">
              <h4 className="text-white font-medium mb-4">{t("social")}</h4>
              <div className="flex items-center gap-3">
                <Link
                  href="https://github.com/AliValizade"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("githubProfile")}
                  title="GitHub"
                  className="w-11 h-11 rounded-xl bg-[#111C33] border border-[#1E3A5F] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#3B82F6] transition-all"
                >
                  <FaGithub size={21} aria-hidden="true" />
                </Link>

                <Link
                  href="https://www.linkedin.com/in/alivalizade/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("linkedinProfile")}
                  title="LinkedIn"
                  className="w-11 h-11 rounded-xl bg-[#111C33] border border-[#1E3A5F] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#3B82F6] transition-all"
                >
                  <FaLinkedin size={21} aria-hidden="true" />
                </Link>

                <Link
                  href="https://t.me/titechco"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("telegramChannel")}
                  title="Telegram"
                  className="w-11 h-11 rounded-xl bg-[#111C33] border border-[#1E3A5F] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#3B82F6] transition-all"
                >
                  <Send size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6 md:p-8"
          >
            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  {t("successTitle")}
                </h3>
                <p className="text-[#94A3B8] text-sm mb-6">
                  {t("successDescription")}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-[#3B82F6] text-sm hover:underline"
                >
                  {t("sendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-[#94A3B8] mb-2">{t("name")}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B1426] border border-[#1E3A5F] text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] transition-colors"
                    placeholder={t("namePlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#94A3B8] mb-2">{t("email")}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B1426] border border-[#1E3A5F] text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] transition-colors"
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#94A3B8] mb-2">{t("message")}</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B1426] border border-[#1E3A5F] text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
                    placeholder={t("messagePlaceholder")}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  {loading ? t("sending") : t("send")}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}