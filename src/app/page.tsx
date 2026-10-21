import Link from 'next/link';
import { siteConfig, education, interests } from '@/lib/data';
import { getPostEntries } from '@/lib/content';
import PostCard from '@/components/PostCard';

export default function HomePage() {
  const latest = getPostEntries()[0];

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

      {/* Latest */}
      {latest && (
        <section className="homepage-section">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="mb-0">Latest</h2>
            <Link
              href="/posts"
              className="text-sm hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              All posts &rarr;
            </Link>
          </div>
          <PostCard entry={latest} />
        </section>
      )}
    </div>
  );
}
