import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllResearch, getResearchBySlug } from '@/lib/content';
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

  const authors = (item.frontmatter.authors || []).map((a) =>
    typeof a === 'string' ? a : a.name
  );

  return (
    <div>
      <Link
        href="/research"
        className="text-sm hover:underline"
        style={{ color: 'var(--accent)' }}
      >
        &larr; Research
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="leading-tight mb-3">
          {item.frontmatter.title}
        </h1>

        <div className="flex flex-wrap items-baseline gap-x-3 text-sm" style={{ color: 'var(--fg-muted)' }}>
          {item.frontmatter.venue && <span>{item.frontmatter.venue}</span>}
          {authors.length > 0 && <span>{authors.join(', ')}</span>}
          {item.frontmatter.date && (
            <span>
              {new Date(item.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </span>
          )}
        </div>

        {item.frontmatter.links && item.frontmatter.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {item.frontmatter.links.map((link) => (
              <a
                key={link.name}
                href={link.url || link.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs px-3 py-1 rounded border transition-colors"
                style={{
                  borderColor: 'var(--fg-muted)',
                  color: 'var(--fg-heading)',
                }}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </header>

      <MdxContent source={item.content} />
    </div>
  );
}
