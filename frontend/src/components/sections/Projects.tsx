"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { getProjects } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";

interface Project {
  id: number;
  title: string;
  title_en?: string;
  short_description: string;
  short_description_en?: string;
  technologies_list: string[];
  github_url?: string;
  demo_url?: string;
  is_featured: boolean;
}

export default function Projects() {
  const t = useTranslations("Projects");
  const locale = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((data) => {
        // اگر paginated باشد
        setProjects(data.results || data);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-24 px-4">
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
        ) : projects.length === 0 ? (
          <div className="text-center text-[#94A3B8]">
            {t("empty")}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-[#111C33] border border-[#1E3A5F] rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-all duration-300"
              >
                {project.is_featured && (
                  <span className="absolute top-4 left-4 text-xs px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6]">
                    {t("featured")}
                  </span>
                )}

                <h3 className="text-xl font-semibold text-white mb-3 mt-2">
                  {locale === "en" ? (project.title_en || project.title) : project.title}
                </h3>

                <p className="text-[#94A3B8] text-sm leading-relaxed mb-5">
                  {locale === "en" ? (project.short_description_en || project.short_description) : project.short_description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies_list?.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#0B1426] text-[#94A3B8] border border-[#1E3A5F]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {project.github_url && (
                    <Link
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                    >
                      <FaGithub size={18} aria-hidden="true" />
                      <span>GitHub</span>
                    </Link>
                  )}
                  {project.demo_url && (
                    <Link
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                    >
                      <ExternalLink size={16} />
                      <span>{t("demo")}</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}