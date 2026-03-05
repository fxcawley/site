import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/content';
import { serializeMdx } from '@/lib/mdx';
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

  const mdxSource = await serializeMdx(post.content);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-sm text-[rgb(var(--muted-foreground))] hover:text-accent-600 transition-colors mb-8"
      >
        <ArrowLeft size={14} /> Back to posts
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold leading-tight mb-3">{post.frontmatter.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--muted-foreground))]">
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
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
      </header>

      <MdxContent source={mdxSource} />
    </div>
  );
}
