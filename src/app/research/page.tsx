import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { getAllResearch } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Research',
};

export default function ResearchPage() {
  const research = getAllResearch();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Research</h1>
      <p className="text-[rgb(var(--muted-foreground))] mb-10">
        Publications, projects, and technical explorations.
      </p>

      <div className="space-y-5">
        {research.map((item) => {
          const authors = (item.frontmatter.authors || []).map((a) =>
            typeof a === 'string' ? a : a.name
          );

          return (
            <div
              key={item.slug}
              className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 hover:border-accent-300 dark:hover:border-accent-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/research/${item.slug}`}
                    className="font-semibold text-lg hover:text-accent-600 transition-colors leading-snug inline-block"
                  >
                    {item.frontmatter.title}
                  </Link>

                  {item.frontmatter.venue && (
                    <p className="text-sm text-accent-600 dark:text-accent-400 mt-1">
                      {item.frontmatter.venue}
                    </p>
                  )}

                  {authors.length > 0 && (
                    <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
                      {authors.join(', ')}
                    </p>
                  )}

                  <p className="text-sm text-[rgb(var(--muted-foreground))] mt-2 line-clamp-2">
                    {item.frontmatter.excerpt}
                  </p>

                  {/* Tags */}
                  {item.frontmatter.tags && item.frontmatter.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  {item.frontmatter.links && item.frontmatter.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.frontmatter.links.map((link) => (
                        <a
                          key={link.name}
                          href={link.url || link.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border border-[rgb(var(--border))] hover:border-accent-400 hover:text-accent-600 transition-colors"
                        >
                          <ExternalLink size={12} />
                          {link.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <Link href={`/research/${item.slug}`} className="shrink-0 mt-1">
                  <ChevronRight size={18} className="text-[rgb(var(--muted-foreground))] hover:text-accent-600 transition-colors" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
