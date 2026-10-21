import type { Metadata } from 'next';
import { getPostEntries } from '@/lib/content';
import PostCard from '@/components/PostCard';

export const metadata: Metadata = {
  title: 'Posts',
};

export default function PostsPage() {
  const entries = getPostEntries();

  return (
    <div>
      <h1>Posts</h1>

      <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--fg-muted)' }}>
        Given a binding time-budget constraint, distracted subscribers may only be able to read
        certain posts at stochastic intervals -- or, put less formally, when they have a spare
        moment.
      </p>
      <p className="text-xs mb-6" style={{ color: 'var(--fg-muted)' }}>
        I'm a big fan of {' '}
        <a
          href="https://www.bloomberg.com/account/newsletters/money-stuff"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: 'var(--fg-heading)' }}
        >
          Money Stuff
        </a>
        .
      </p>

      {entries.length === 0 ? (
        <p style={{ color: 'var(--fg-muted)' }}>Nothing here yet.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <PostCard
              key={entry.kind === 'thread' ? `thread-${entry.thread.id}` : `post-${entry.post.slug}`}
              entry={entry}
            />
          ))}
        </div>
      )}
    </div>
  );
}
