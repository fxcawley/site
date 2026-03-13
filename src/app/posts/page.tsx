import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Posts',
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div>
      <h1>Posts</h1>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--fg-muted)' }}>Nothing here yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
