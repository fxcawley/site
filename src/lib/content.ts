import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  cover?: string;
}

export interface ResearchFrontmatter {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  venue: string;
  authors: (string | { name: string; url?: string })[];
  selected: boolean;
  priority: number;
  cover?: string;
  links?: { name: string; url?: string; file?: string }[];
}

export interface ContentItem<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

function getContentFromDirectory<T>(subdir: string): ContentItem<T>[] {
  const dir = path.join(contentDirectory, subdir);
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items: ContentItem<T>[] = [];

  for (const entry of entries) {
    let filePath: string;
    let slug: string;

    if (entry.isDirectory()) {
      // Look for index.md or index.mdx inside the directory
      const indexMd = path.join(dir, entry.name, 'index.md');
      const indexMdx = path.join(dir, entry.name, 'index.mdx');
      if (fs.existsSync(indexMdx)) {
        filePath = indexMdx;
      } else if (fs.existsSync(indexMd)) {
        filePath = indexMd;
      } else {
        continue;
      }
      slug = entry.name;
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      filePath = path.join(dir, entry.name);
      slug = entry.name.replace(/\.mdx?$/, '');
    } else {
      continue;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    items.push({
      slug,
      frontmatter: data as T,
      content,
    });
  }

  return items;
}

export function getAllPosts(): ContentItem<PostFrontmatter>[] {
  return getContentFromDirectory<PostFrontmatter>('posts').sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

export function getPostBySlug(slug: string): ContentItem<PostFrontmatter> | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllResearch(): ContentItem<ResearchFrontmatter>[] {
  return getContentFromDirectory<ResearchFrontmatter>('research').sort(
    (a, b) => (a.frontmatter.priority ?? 99) - (b.frontmatter.priority ?? 99)
  );
}

export function getResearchBySlug(slug: string): ContentItem<ResearchFrontmatter> | undefined {
  return getAllResearch().find((r) => r.slug === slug);
}

export interface CourseFrontmatter {
  title: string;
  code?: string;
  term?: string;
  date: string;
  excerpt?: string;
  topics?: string[];
}

export function getAllCourses(): ContentItem<CourseFrontmatter>[] {
  return getContentFromDirectory<CourseFrontmatter>('courses').sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

export function getCourseBySlug(slug: string): ContentItem<CourseFrontmatter> | undefined {
  return getAllCourses().find((c) => c.slug === slug);
}
