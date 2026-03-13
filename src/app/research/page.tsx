import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllResearch } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Research',
};

export default function ResearchPage() {
  const research = getAllResearch();

  return (
    <div>
      <h1>Research</h1>

      <div className="space-y-4">
        {research.map((item) => {
          const authors = (item.frontmatter.authors || []).map((a) =>
            typeof a === 'string' ? a : a.name
          );

          return (
            <article key={item.slug} className="panel">
              <h5 className="text-base font-semibold mb-1" style={{ color: 'var(--fg-heading)' }}>
                <Link
                  href={`/research/${item.slug}`}
                  className="hover:underline"
                  style={{ color: 'var(--fg-heading)' }}
                >
                  {item.frontmatter.title}
                </Link>
              </h5>

              {authors.length > 0 && (
                <p className="text-sm mb-1" style={{ color: 'var(--fg-secondary)' }}>
                  {authors.join(', ')}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: 'var(--fg-muted)' }}>
                {item.frontmatter.venue && <span>{item.frontmatter.venue}</span>}
                {item.frontmatter.date && (
                  <>
                    {item.frontmatter.venue && <span style={{ color: 'var(--border)' }}>|</span>}
                    <span>{new Date(item.frontmatter.date).getFullYear()}</span>
                  </>
                )}
              </div>

              {item.frontmatter.excerpt && (
                <p className="text-sm leading-relaxed mt-2 line-clamp-3" style={{ color: 'var(--fg)' }}>
                  {item.frontmatter.excerpt}
                </p>
              )}

              {item.frontmatter.links && item.frontmatter.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.frontmatter.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.url || link.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs px-3 py-1 rounded border transition-colors"
                      style={{
                        borderColor: 'var(--fg-muted)',
                        color: 'var(--fg-heading)',
                      }}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
