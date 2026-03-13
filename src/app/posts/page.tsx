import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, getThreads } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Posts',
};

export default function PostsPage() {
  const allPosts = getAllPosts();
  const threads = getThreads();

  // standalone posts = those without a thread
  const standalonePosts = allPosts.filter((p) => !p.frontmatter.thread);

  // For ordering: threads sorted by their latest post date
  const threadEntries = threads.map((t) => ({
    kind: 'thread' as const,
    thread: t,
    sortDate: Math.max(...t.posts.map((p) => new Date(p.frontmatter.date).getTime())),
  }));

  const standaloneEntries = standalonePosts.map((p) => ({
    kind: 'post' as const,
    post: p,
    sortDate: new Date(p.frontmatter.date).getTime(),
  }));

  const entries = [...threadEntries, ...standaloneEntries].sort(
    (a, b) => b.sortDate - a.sortDate
  );

  return (
    <div>
      <h1>Posts</h1>

      {entries.length === 0 ? (
        <p style={{ color: 'var(--fg-muted)' }}>Nothing here yet.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            if (entry.kind === 'thread') {
              const { thread } = entry;
              return (
                <article key={`thread-${thread.id}`} className="panel">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      thread
                    </span>
                    <span className="text-base font-semibold" style={{ color: 'var(--fg-heading)' }}>
                      {thread.title}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                      {thread.posts.length} {thread.posts.length === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                  <div className="space-y-2 ml-1">
                    {thread.posts.map((post, i) => (
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
              );
            }

            const { post } = entry;
            return (
              <article key={post.slug} className="panel">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm shrink-0 tabular-nums" style={{ color: 'var(--fg-muted)' }}>
                    {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-base font-semibold hover:underline"
                    style={{ color: 'var(--fg-heading)' }}
                  >
                    {post.frontmatter.title}
                  </Link>
                </div>
                {post.frontmatter.excerpt && (
                  <p className="text-sm leading-relaxed mt-1 line-clamp-2" style={{ color: 'var(--fg)' }}>
                    {post.frontmatter.excerpt}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
