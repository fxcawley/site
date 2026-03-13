import type { Metadata } from 'next';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <div>
      <h1>Contact</h1>

      <p className="leading-relaxed mb-6" style={{ color: 'var(--fg)' }}>
        Reach out for collaborations, questions, or conversation.
      </p>

      <div className="space-y-2" style={{ color: 'var(--fg)' }}>
        <p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            {siteConfig.email}
          </a>
        </p>
      </div>

      <div className="flex gap-4 mt-6 text-sm" style={{ color: 'var(--fg-muted)' }}>
        {siteConfig.social.map((link, i) => (
          <a
            key={`${link.name}-${i}`}
            href={link.url}
            target={link.url.startsWith('/') || link.url.startsWith('mailto:') ? undefined : '_blank'}
            rel={link.url.startsWith('/') || link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="hover:underline transition-colors"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
