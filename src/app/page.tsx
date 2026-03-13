import Link from 'next/link';
import { siteConfig, education, interests, experience, awards } from '@/lib/data';
import { getAllResearch } from '@/lib/content';

function ResearchCard({ item }: { item: ReturnType<typeof getAllResearch>[number] }) {
  const authors = (item.frontmatter.authors || []).map((a) =>
    typeof a === 'string' ? a : a.name
  );

  return (
    <div className="panel">
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

      <div className="flex flex-wrap items-center gap-2 text-sm mb-2" style={{ color: 'var(--fg-muted)' }}>
        {item.frontmatter.date && (
          <span>{new Date(item.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
        )}
        {item.frontmatter.venue && (
          <>
            <span className="text-[var(--border)]">|</span>
            <span>{item.frontmatter.venue}</span>
          </>
        )}
      </div>

      {item.frontmatter.excerpt && (
        <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--fg)' }}>
          {item.frontmatter.excerpt.length > 200
            ? item.frontmatter.excerpt.slice(0, 200) + '...'
            : item.frontmatter.excerpt}
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
    </div>
  );
}

export default function HomePage() {
  const research = getAllResearch();
  const selected = research.filter((r) => r.frontmatter.selected);

  return (
    <div>
      {/* About Me */}
      <section className="homepage-section">
        <h1 className="titleSeparate">About Me</h1>
        {siteConfig.introduction.map((line, i) => (
          <p key={i} className="leading-relaxed mb-3" style={{ color: 'var(--fg)' }}>
            {line}
          </p>
        ))}

        {siteConfig.modelTypes && (
          <div className="ml-6 mb-4 space-y-1">
            {siteConfig.modelTypes.map((m) => (
              <p key={m.name} className="leading-relaxed" style={{ color: 'var(--fg)' }}>
                <em className="not-italic font-semibold" style={{ color: 'var(--fg-heading)' }}>{m.name}</em>: {m.description}
              </p>
            ))}
          </div>
        )}

        {siteConfig.aside && (
          <p className="leading-relaxed mb-1" style={{ color: 'var(--fg)' }}>
            {siteConfig.aside}
          </p>
        )}
        {siteConfig.reading && (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            I&rsquo;m a fan of {siteConfig.reading}
          </p>
        )}
      </section>

      {/* Education & Interests */}
      <section className="homepage-section">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Education */}
          <div className="md:w-3/5">
            <h2 className="mb-4">Education</h2>
            <div>
              {education.map((item, i) => (
                <div key={i} className="timeline-item">
                  <h6 className="text-sm font-semibold" style={{ color: 'var(--fg-heading)' }}>
                    {item.title}
                  </h6>
                  <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>
                    {item.location}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="md:w-2/5">
            <h2 className="mb-4">Interests</h2>
            <div className="space-y-2">
              {interests.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: 'var(--accent)' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--fg)' }}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      {awards.length > 0 && (
        <section className="homepage-section">
          <h2 className="mb-4">Awards &amp; Scholarships</h2>
          <div>
            {awards.map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <h6 className="text-sm font-semibold" style={{ color: 'var(--fg-heading)' }}>
                    {item.title}
                  </h6>
                  <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Research */}
      {selected.length > 0 && (
        <section className="homepage-section">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="mb-0">Selected Research</h2>
            <Link
              href="/research"
              className="text-sm hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              All research &rarr;
            </Link>
          </div>
          <div className="space-y-4">
            {selected.map((item) => (
              <ResearchCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
