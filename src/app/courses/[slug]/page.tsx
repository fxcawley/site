import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCourses, getCourseBySlug } from '@/lib/content';
import MdxContent from '@/components/MdxContent';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourseBySlug(params.slug);
  if (!course) return {};
  return {
    title: course.frontmatter.title,
    description: course.frontmatter.excerpt,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

  return (
    <div>
      <Link
        href="/courses"
        className="text-sm hover:underline"
        style={{ color: 'var(--accent)' }}
      >
        &larr; Courses
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="leading-tight mb-2">
          {course.frontmatter.title}
        </h1>
        <div className="flex flex-wrap items-baseline gap-x-3 text-sm" style={{ color: 'var(--fg-muted)' }}>
          {course.frontmatter.code && <span>{course.frontmatter.code}</span>}
          {course.frontmatter.term && <span>{course.frontmatter.term}</span>}
        </div>
      </header>

      <MdxContent source={course.content} />
    </div>
  );
}
