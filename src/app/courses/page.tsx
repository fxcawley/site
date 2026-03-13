import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCourses } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Courses',
};

export default function CoursesPage() {
  const courses = getAllCourses();

  return (
    <div>
      <h1>Courses</h1>

      {courses.length === 0 ? (
        <p style={{ color: 'var(--fg-muted)' }}>Notes coming soon.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <article key={course.slug} className="panel">
              <Link
                href={`/courses/${course.slug}`}
                className="text-base font-semibold hover:underline"
                style={{ color: 'var(--fg-heading)' }}
              >
                {course.frontmatter.title}
              </Link>
              <div className="flex flex-wrap items-baseline gap-x-3 mt-1 text-sm" style={{ color: 'var(--fg-muted)' }}>
                {course.frontmatter.code && <span>{course.frontmatter.code}</span>}
                {course.frontmatter.term && <span>{course.frontmatter.term}</span>}
              </div>
              {course.frontmatter.excerpt && (
                <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--fg)' }}>
                  {course.frontmatter.excerpt}
                </p>
              )}
              {course.frontmatter.topics && course.frontmatter.topics.length > 0 && (
                <p className="text-xs mt-2" style={{ color: 'var(--fg-muted)' }}>
                  {course.frontmatter.topics.join(' \u00b7 ')}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
