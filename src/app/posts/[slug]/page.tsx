import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/content';
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

  return (
    <div>
      <Link
        href="/posts"
        className="text-sm hover:underline"
        style={{ color: 'var(--accent)' }}
      >
        &larr; Posts
      </Link>

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
    </div>
  );
}
