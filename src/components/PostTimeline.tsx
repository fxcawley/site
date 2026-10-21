export function PostDate({ date }: { date: string }) {
  return (
    <time dateTime={date}>
      {new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      })}
    </time>
  );
}

interface Props {
  startedAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export default function PostTimeline({ startedAt, updatedAt, publishedAt }: Props) {
  const events = [{ label: 'Started', date: startedAt }];
  if (publishedAt && publishedAt.slice(0, 10) !== startedAt.slice(0, 10)) {
    events.push({ label: 'Post published', date: publishedAt });
  }
  events.push({ label: 'Last updated', date: updatedAt });

  return (
    <ol
      aria-label="Project timeline"
      className="post-timeline"
      style={{ gridTemplateColumns: `repeat(${events.length}, minmax(0, 1fr))` }}
    >
      {events.map((event) => (
        <li key={event.label}>
          <span className="block text-xs mb-1" style={{ color: 'var(--fg-muted)' }}>
            {event.label}
          </span>
          <span className="block text-sm tabular-nums" style={{ color: 'var(--fg-secondary)' }}>
            <PostDate date={event.date} />
          </span>
        </li>
      ))}
    </ol>
  );
}
