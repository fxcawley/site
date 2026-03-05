import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { getAllResearch, getResearchBySlug } from '@/lib/content';
import { serializeMdx } from '@/lib/mdx';
import MdxContent from '@/components/MdxContent';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllResearch().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getResearchBySlug(params.slug);
  if (!item) return {};
  return {
    title: item.frontmatter.title,
    description: item.frontmatter.excerpt,
  };
}

export default async function ResearchDetailPage({ params }: Props) {
  const item = getResearchBySlug(params.slug);
  if (!item) notFound();

  const mdxSource = await serializeMdx(item.content);

  const authors = (item.frontmatter.authors || []).map((a) =>
    typeof a === 'string' ? a : a.name
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/research"
        className="inline-flex items-center gap-1.5 text-sm text-[rgb(var(--muted-foreground))] hover:text-accent-600 transition-colors mb-8"
      >
        <ArrowLeft size={14} /> Back to research
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold leading-tight mb-3">{item.frontmatter.title}</h1>

        {item.frontmatter.venue && (
          <p className="text-accent-600 dark:text-accent-400 font-medium">{item.frontmatter.venue}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[rgb(var(--muted-foreground))]">
          {authors.length > 0 && <span>{authors.join(', ')}</span>}
          {item.frontmatter.date && (
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {new Date(item.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </span>
          )}
        </div>

        {/* Links */}
        {item.frontmatter.links && item.frontmatter.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {item.frontmatter.links.map((link) => (
              <a
                key={link.name}
                href={link.url || link.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-[rgb(var(--border))] hover:border-accent-400 hover:text-accent-600 transition-colors"
              >
                <ExternalLink size={13} />
                {link.name}
              </a>
            ))}
          </div>
        )}

        {/* Tags */}
        {item.frontmatter.tags && item.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {item.frontmatter.tags.map((tag) => (
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
