import Link from 'next/link';
import type { ThreadInfo } from '@/lib/content';
import { PostDate } from './PostTimeline';

export default function ThreadFlow({ thread }: { thread: ThreadInfo }) {
  return (
    <section className="thread-map" aria-label="Thread progression">
      <div className="thread-map-heading">
        <p className="font-mono text-xs uppercase tracking-wider">Reading path</p>
        <p className="text-xs">The double ring marks the latest post.</p>
      </div>

      <ol className="thread-flow" aria-label="Posts and transitions in reading order">
        {thread.posts.map((post, index) => {
          const nextPost = thread.posts[index + 1];
          // The destination post describes the transition into it.
          const transition = nextPost?.frontmatter.threadTransition;
          const isLatest = index === thread.posts.length - 1;
          const hasRevision =
            post.frontmatter.updatedAt.slice(0, 10) !== post.frontmatter.date.slice(0, 10);

          return (
            <li key={post.slug} className="thread-step" id={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="thread-state-link"
                aria-labelledby={`title-${post.slug}`}
              >
                <span
                  className={`thread-node${isLatest ? ' thread-node-latest' : ''}`}
                  aria-hidden="true"
                >
                  <span>q<sub>{index}</sub></span>
                </span>

                <article className="thread-state">
                  <div className="thread-state-heading">
                    <span className="font-mono text-xs">
                      Post {String(index + 1).padStart(2, '0')}
                    </span>
                    {isLatest && <span className="thread-latest-label">Latest post</span>}
                  </div>
                  <h2 id={`title-${post.slug}`} className="thread-state-title">
                    {post.frontmatter.title}
                  </h2>
                  {post.frontmatter.excerpt && (
                    <p className="thread-post-summary">{post.frontmatter.excerpt}</p>
                  )}
                  <dl className="thread-post-dates">
                    <div>
                      <dt>Published</dt>
                      <dd><PostDate date={post.frontmatter.date} /></dd>
                    </div>
                    {hasRevision && (
                      <div>
                        <dt>Updated</dt>
                        <dd><PostDate date={post.frontmatter.updatedAt} /></dd>
                      </div>
                    )}
                  </dl>
                  <span className="thread-read-link" aria-hidden="true">Read post &rarr;</span>
                </article>
              </Link>

              {nextPost && (
                <div className="thread-transition">
                  <p className="thread-transition-label">
                    {transition?.label || 'Next post'}
                  </p>
                  {transition?.description && (
                    <p className="thread-transition-description">{transition.description}</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
