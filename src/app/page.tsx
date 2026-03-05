import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Mail, Brain, Layers, Code,
  Briefcase, GraduationCap, Award, Heart, BookOpen,
  ArrowRight, ChevronRight,
} from 'lucide-react';
import { siteConfig, education, interests, experience, awards } from '@/lib/data';
import { getAllResearch } from '@/lib/content';

const interestIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Machine Learning': Brain,
  'Mechanistic Interpretability': Layers,
  'Open Source Community': Code,
};

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Work: Briefcase,
  Teaching: BookOpen,
  Volunteer: Heart,
};

export default function HomePage() {
  const research = getAllResearch();
  const selectedResearch = research.filter((r) => r.frontmatter.selected);

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
        <div className="shrink-0">
          <Image
            src={siteConfig.avatar}
            alt={siteConfig.author}
            width={180}
            height={180}
            className="rounded-full border-4 border-[rgb(var(--border))] shadow-lg"
            priority
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {siteConfig.author}
          </h1>
          <p className="text-lg text-accent-600 dark:text-accent-400 font-medium mb-4">
            {siteConfig.professions.join(' · ')}
          </p>
          {siteConfig.introduction.map((line, i) => (
            <p key={i} className="text-[rgb(var(--muted-foreground))] leading-relaxed max-w-xl">
              {line}
            </p>
          ))}
          <div className="flex flex-wrap items-center gap-4 mt-5 justify-center md:justify-start text-sm text-[rgb(var(--muted-foreground))]">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} /> {siteConfig.location}
            </span>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 hover:text-accent-600 transition-colors">
              <Mail size={15} /> {siteConfig.email}
            </a>
          </div>
        </div>
      </section>

      {/* Interests */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-6">Interests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {interests.map((item) => {
            const Icon = interestIcons[item.title] || Code;
            return (
              <div key={item.title} className="flex items-center gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
                <div className="rounded-lg bg-accent-50 dark:bg-accent-900/30 p-2.5 text-accent-600 dark:text-accent-400">
                  <Icon size={22} />
                </div>
                <span className="font-medium">{item.title}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Education */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-6">Education</h2>
        <div className="space-y-4">
          {education.map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="mt-1 rounded-lg bg-accent-50 dark:bg-accent-900/30 p-2.5 text-accent-600 dark:text-accent-400">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">{item.location}</p>
                <p className="text-xs text-[rgb(var(--muted-foreground))] mt-0.5">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Research */}
      {selectedResearch.length > 0 && (
        <section className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Selected Research</h2>
            <Link href="/research" className="text-sm text-accent-600 hover:text-accent-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {selectedResearch.map((item) => (
              <Link
                key={item.slug}
                href={`/research/${item.slug}`}
                className="block rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 hover:border-accent-300 dark:hover:border-accent-700 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold group-hover:text-accent-600 transition-colors leading-snug">
                      {item.frontmatter.title}
                    </h3>
                    {item.frontmatter.venue && (
                      <p className="text-sm text-accent-600 dark:text-accent-400 mt-1">{item.frontmatter.venue}</p>
                    )}
                    <p className="text-sm text-[rgb(var(--muted-foreground))] mt-2 line-clamp-2">
                      {item.frontmatter.excerpt}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-[rgb(var(--muted-foreground))] shrink-0 mt-1 group-hover:text-accent-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-6">Experience</h2>
        <div className="space-y-10">
          {experience.map((cat) => {
            const CatIcon = categoryIcons[cat.category] || Briefcase;
            return (
              <div key={cat.category}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CatIcon size={18} className="text-accent-600 dark:text-accent-400" />
                  {cat.category}
                </h3>
                <div className="border-l-2 border-[rgb(var(--border))] pl-6 space-y-6 ml-2">
                  {cat.items.map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-accent-500 bg-[rgb(var(--background))]" />
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-accent-600 dark:text-accent-400">{item.location}</p>
                      <p className="text-xs text-[rgb(var(--muted-foreground))] mb-1">{item.date}</p>
                      <p className="text-sm text-[rgb(var(--muted-foreground))] leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Awards */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-6">Awards</h2>
        <div className="space-y-3">
          {awards.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <Award size={18} className="text-accent-600 dark:text-accent-400 shrink-0" />
              <div>
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-[rgb(var(--muted-foreground))] ml-2">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
