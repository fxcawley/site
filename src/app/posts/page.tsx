import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, ChevronRight } from 'lucide-react';
import { getAllPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Posts',
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Posts</h1>
      <p className="text-[rgb(var(--muted-foreground))] mb-10">
        Notes, write-ups, and explorations.
      </p>

      {posts.length === 0 ? (
        <p className="text-[rgb(var(--muted-foreground))]">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="block rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 hover:border-accent-300 dark:hover:border-accent-700 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-semibold text-lg group-hover:text-accent-600 transition-colors">
                    {post.frontmatter.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 text-sm text-[rgb(var(--muted-foreground))]">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {post.frontmatter.excerpt && (
                    <p className="text-sm text-[rgb(var(--muted-foreground))] mt-2 line-clamp-2">
                      {post.frontmatter.excerpt}
                    </p>
                  )}
                  {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronRight size={18} className="text-[rgb(var(--muted-foreground))] shrink-0 mt-1.5 group-hover:text-accent-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
