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
  thread?: string;
  threadTitle?: string;
  threadOrder?: number;
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

export interface ThreadInfo {
  id: string;
  title: string;
  posts: ContentItem<PostFrontmatter>[];
}

export function getThreads(): ThreadInfo[] {
  const posts = getAllPosts();
  const threadMap = new Map<string, ThreadInfo>();

  for (const post of posts) {
    const tid = post.frontmatter.thread;
    if (!tid) continue;
    if (!threadMap.has(tid)) {
      threadMap.set(tid, {
        id: tid,
        title: post.frontmatter.threadTitle || tid,
        posts: [],
      });
    }
    threadMap.get(tid)!.posts.push(post);
  }

  const result = Array.from(threadMap.values());
  for (const thread of result) {
    thread.posts.sort(
      (a, b) => (a.frontmatter.threadOrder ?? 0) - (b.frontmatter.threadOrder ?? 0)
    );
  }

  return result;
}

export function getThreadForPost(slug: string): { thread: ThreadInfo; index: number } | null {
  const post = getPostBySlug(slug);
  if (!post?.frontmatter.thread) return null;
  const threads = getThreads();
  const thread = threads.find((t) => t.id === post.frontmatter.thread);
  if (!thread) return null;
  const index = thread.posts.findIndex((p) => p.slug === slug);
  return { thread, index };
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
