import { siteConfig } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--fg-muted)' }}>
            {siteConfig.social.map((link, i) => (
              <a
                key={`${link.name}-${i}`}
                href={link.url}
                target={link.url.startsWith('/') || link.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.url.startsWith('/') || link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="hover:underline transition-colors"
                style={{ color: 'var(--fg-muted)' }}
              >
                {link.name}
              </a>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
            &copy; {new Date().getFullYear()} {siteConfig.author}
          </p>
        </div>
      </div>
    </footer>
  );
}
