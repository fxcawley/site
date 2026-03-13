import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug, getThreadForPost } from '@/lib/content';
import MdxContent from '@/components/MdxContent';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
  };
}

export default async function PostDetailPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const threadInfo = getThreadForPost(params.slug);

  return (
    <div>
      <Link
        href="/posts"
        className="text-sm hover:underline"
        style={{ color: 'var(--accent)' }}
      >
        &larr; Posts
      </Link>

      {threadInfo && (
        <div
          className="mt-3 flex items-center gap-2 text-sm"
          style={{ color: 'var(--fg-muted)' }}
        >
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            thread
          </span>
          <span style={{ color: 'var(--fg-secondary)' }}>
            {threadInfo.thread.title} &middot; {threadInfo.index + 1}/{threadInfo.thread.posts.length}
          </span>
        </div>
      )}

      <header className="mt-4 mb-8">
        <h1 className="leading-tight mb-2">
          {post.frontmatter.title}
        </h1>
        <span className="text-sm" style={{ color: 'var(--fg-muted)' }}>
          {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </header>

      <MdxContent source={post.content} />

      {threadInfo && (
        <nav
          className="mt-12 pt-6 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {threadInfo.index > 0 ? (
            <Link
              href={`/posts/${threadInfo.thread.posts[threadInfo.index - 1].slug}`}
              className="text-sm hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              &larr; {threadInfo.thread.posts[threadInfo.index - 1].frontmatter.title}
            </Link>
          ) : (
            <span />
          )}
          {threadInfo.index < threadInfo.thread.posts.length - 1 ? (
            <Link
              href={`/posts/${threadInfo.thread.posts[threadInfo.index + 1].slug}`}
              className="text-sm hover:underline text-right"
              style={{ color: 'var(--accent)' }}
            >
              {threadInfo.thread.posts[threadInfo.index + 1].frontmatter.title} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
