import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getThreads, getThreadById } from '@/lib/content';
import PostTimeline from '@/components/PostTimeline';
import ThreadFlow from '@/components/ThreadFlow';

interface Props {
  params: { id: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getThreads().map((thread) => ({ id: thread.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const thread = getThreadById(params.id);
  if (!thread) return {};
  return {
    title: thread.title,
    description: thread.overview,
  };
}

export default function ThreadPage({ params }: Props) {
  const thread = getThreadById(params.id);
  if (!thread) notFound();

  return (
    <div>
      <Link href="/posts" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
        &larr; Posts
      </Link>

      <header className="mt-6 mb-8">
        <p className="font-mono text-xs uppercase tracking-wider mb-3">
          Thread &middot; {thread.posts.length} {thread.posts.length === 1 ? 'post' : 'posts'}
        </p>
        <h1 className="mb-4">{thread.title}</h1>
        {thread.overview && (
          <p className="text-sm leading-7 mb-6">{thread.overview}</p>
        )}
        <PostTimeline startedAt={thread.startedAt} updatedAt={thread.updatedAt} />
        <p className="text-xs leading-relaxed">
          Posts follow their reading order. Each shows its publication date and latest revision.
        </p>
      </header>

      <ThreadFlow thread={thread} />
    </div>
  );
}
