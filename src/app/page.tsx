import Link from 'next/link';
import { siteConfig, education, interests } from '@/lib/data';
import { getAllPosts, getThreads } from '@/lib/content';

function getLatestEntry() {
  const allPosts = getAllPosts();
  const threads = getThreads();

  const threadEntries = threads.map((t) => ({
    kind: 'thread' as const,
    thread: t,
    sortDate: Math.max(...t.posts.map((p) => new Date(p.frontmatter.date).getTime())),
  }));

  const standaloneEntries = allPosts
    .filter((p) => !p.frontmatter.thread)
    .map((p) => ({
      kind: 'post' as const,
      post: p,
      sortDate: new Date(p.frontmatter.date).getTime(),
    }));

  const entries = [...threadEntries, ...standaloneEntries].sort(
    (a, b) => b.sortDate - a.sortDate
  );

  return entries[0] ?? null;
}

export default function HomePage() {
  const latest = getLatestEntry();

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
          {latest.kind === 'thread' ? (
            <article className="panel">
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  thread
                </span>
                <span className="text-base font-semibold" style={{ color: 'var(--fg-heading)' }}>
                  {latest.thread.title}
                </span>
                <span className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                  {latest.thread.posts.length} {latest.thread.posts.length === 1 ? 'post' : 'posts'}
                </span>
              </div>
              <div className="space-y-2 ml-1">
                {latest.thread.posts.map((post, i) => (
                  <div key={post.slug} className="flex items-baseline gap-3">
                    <span
                      className="text-xs tabular-nums shrink-0"
                      style={{ color: 'var(--fg-muted)', minWidth: '1.2rem' }}
                    >
                      {i + 1}.
                    </span>
                    <span className="text-sm shrink-0 tabular-nums" style={{ color: 'var(--fg-muted)' }}>
                      {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-sm hover:underline"
                      style={{ color: 'var(--fg-heading)' }}
                    >
                      {post.frontmatter.title}
                    </Link>
                  </div>
                ))}
              </div>
            </article>
          ) : (
            <article className="panel">
              <div className="flex items-baseline gap-4">
                <span className="text-sm shrink-0 tabular-nums" style={{ color: 'var(--fg-muted)' }}>
                  {new Date(latest.post.frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </span>
                <Link
                  href={`/posts/${latest.post.slug}`}
                  className="text-base font-semibold hover:underline"
                  style={{ color: 'var(--fg-heading)' }}
                >
                  {latest.post.frontmatter.title}
                </Link>
              </div>
              {latest.post.frontmatter.excerpt && (
                <p className="text-sm leading-relaxed mt-1 line-clamp-2" style={{ color: 'var(--fg)' }}>
                  {latest.post.frontmatter.excerpt}
                </p>
              )}
            </article>
          )}
        </section>
      )}
    </div>
  );
}
