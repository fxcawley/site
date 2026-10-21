import Link from 'next/link';
import type { PostEntry } from '@/lib/content';
import PostTimeline, { PostDate } from './PostTimeline';

export default function PostCard({ entry }: { entry: PostEntry }) {
  if (entry.kind === 'thread') {
    const { thread } = entry;
    return (
      <article className="panel">
        <div className="flex flex-wrap items-baseline gap-3 mb-2">
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

        <PostTimeline startedAt={thread.startedAt} updatedAt={thread.updatedAt} />

        <ol className="space-y-3 ml-1">
          {thread.posts.map((post, i) => (
            <li key={post.slug} className="flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="text-xs tabular-nums shrink-0"
                style={{ color: 'var(--fg-muted)', minWidth: '1.2rem' }}
              >
                {i + 1}.
              </span>
              <div className="min-w-0">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-sm hover:underline"
                  style={{ color: 'var(--fg-heading)' }}
                >
                  {post.frontmatter.title}
                </Link>
                <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>
                  Updated <PostDate date={post.frontmatter.updatedAt} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </article>
    );
  }

  const { post } = entry;
  return (
    <article className="panel">
      <Link
        href={`/posts/${post.slug}`}
        className="text-base font-semibold hover:underline"
        style={{ color: 'var(--fg-heading)' }}
      >
        {post.frontmatter.title}
      </Link>
      <PostTimeline startedAt={post.frontmatter.date} updatedAt={post.frontmatter.updatedAt} />
      {post.frontmatter.excerpt && (
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--fg)' }}>
          {post.frontmatter.excerpt}
        </p>
      )}
    </article>
  );
}
