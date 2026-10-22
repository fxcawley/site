import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface PostFrontmatter {
  title: string;
  date: string;
  updatedAt: string;
  tags: string[];
  excerpt: string;
  cover?: string;
  thread?: string;
  threadTitle?: string;
  threadOrder?: number;
  threadOverview?: string;
  threadTransition?: {
    label: string;
    description?: string;
  };
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

function getPostUpdateDates(): Map<string, string> {
  const dates = new Map<string, string>();

  try {
    // Read all post dates in one process. Checkout mtimes would make every post
    // appear newly updated on each deployment.
    const history = execFileSync(
      'git',
      ['-c', 'core.quotepath=false', 'log', '--format=updated:%cI', '--name-only', '--no-renames', '--', 'content/posts'],
      { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true }
    );

    let updatedAt = '';
    for (const line of history.split(/\r?\n/)) {
      if (line.startsWith('updated:')) {
        updatedAt = new Date(line.slice('updated:'.length)).toISOString();
      } else if (line && updatedAt && !dates.has(line)) {
        dates.set(line, updatedAt);
      }
    }
  } catch {
    // Source archives and new, uncommitted posts fall back to their listed date.
  }

  return dates;
}

function getContentFromDirectory<T>(subdir: string): ContentItem<T>[] {
  const dir = path.join(contentDirectory, subdir);
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items: ContentItem<T>[] = [];
  const updateDates = subdir === 'posts' ? getPostUpdateDates() : new Map<string, string>();

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

    if (subdir === 'posts') {
      // gray-matter parses unquoted YAML dates as Date objects.
      data.date = new Date(data.date).toISOString();
      const relativePath = path.relative(process.cwd(), filePath).split(path.sep).join('/');
      const committedAt = updateDates.get(relativePath);
      data.updatedAt = committedAt && committedAt > data.date ? committedAt : data.date;
    }

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
    (a, b) =>
      new Date(b.frontmatter.updatedAt).getTime() - new Date(a.frontmatter.updatedAt).getTime() ||
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime() ||
      a.slug.localeCompare(b.slug)
  );
}

export function getPostBySlug(slug: string): ContentItem<PostFrontmatter> | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export interface ThreadInfo {
  id: string;
  title: string;
  overview: string;
  startedAt: string;
  updatedAt: string;
  posts: ContentItem<PostFrontmatter>[];
}

export function getThreads(posts = getAllPosts()): ThreadInfo[] {
  const threadMap = new Map<string, ThreadInfo>();

  for (const post of posts) {
    const tid = post.frontmatter.thread;
    if (!tid) continue;
    if (!threadMap.has(tid)) {
      threadMap.set(tid, {
        id: tid,
        title: post.frontmatter.threadTitle || tid,
        overview: '',
        startedAt: post.frontmatter.date,
        updatedAt: post.frontmatter.updatedAt,
        posts: [],
      });
    }
    const thread = threadMap.get(tid)!;
    thread.posts.push(post);
    if (post.frontmatter.threadTitle) thread.title = post.frontmatter.threadTitle;
    if (post.frontmatter.date < thread.startedAt) thread.startedAt = post.frontmatter.date;
    if (post.frontmatter.updatedAt > thread.updatedAt) thread.updatedAt = post.frontmatter.updatedAt;
  }

  const result = Array.from(threadMap.values());
  for (const thread of result) {
    thread.posts.sort(
      (a, b) =>
        (a.frontmatter.threadOrder ?? 0) - (b.frontmatter.threadOrder ?? 0) ||
        a.frontmatter.date.localeCompare(b.frontmatter.date) ||
        a.slug.localeCompare(b.slug)
    );
    thread.overview =
      thread.posts.find((post) => post.frontmatter.threadOverview)?.frontmatter.threadOverview ||
      thread.posts[0].frontmatter.excerpt ||
      '';
  }

  return result;
}

export function getThreadById(id: string): ThreadInfo | undefined {
  return getThreads().find((thread) => thread.id === id);
}

export type PostEntry =
  | { kind: 'thread'; thread: ThreadInfo }
  | { kind: 'post'; post: ContentItem<PostFrontmatter> };

export function getPostEntries(): PostEntry[] {
  const posts = getAllPosts();
  const threads = new Map(getThreads(posts).map((thread) => [thread.id, thread]));
  const entries: PostEntry[] = [];
  const seenThreads = new Set<string>();

  // Posts are already ordered by their latest edit. A thread takes the position
  // of its most recently edited post while retaining its own reading order.
  for (const post of posts) {
    const tid = post.frontmatter.thread;
    if (tid) {
      if (!seenThreads.has(tid)) {
        entries.push({ kind: 'thread', thread: threads.get(tid)! });
        seenThreads.add(tid);
      }
    } else {
      entries.push({ kind: 'post', post });
    }
  }

  return entries;
}

export function getThreadForPost(slug: string): { thread: ThreadInfo; index: number } | null {
  const posts = getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post?.frontmatter.thread) return null;
  const threads = getThreads(posts);
  const thread = threads.find((t) => t.id === post.frontmatter.thread);
  if (!thread) return null;
  const index = thread.posts.findIndex((p) => p.slug === slug);
  return { thread, index };
}

export function getAllResearch(): ContentItem<ResearchFrontmatter>[] {
  return getContentFromDirectory<ResearchFrontmatter>('research').sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
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
