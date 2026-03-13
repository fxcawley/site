'use client';

import { siteConfig } from '@/lib/data';

const socialIcons: Record<string, string> = {
  cv: 'CV',
  github: 'GH',
  scholar: 'GS',
  email: '@',
};

export default function Sidebar() {
  const arr = siteConfig.author.split(' ');
  const firstName = arr.slice(0, arr.length - 1).join(' ');
  const lastName = arr[arr.length - 1];

  return (
    <aside className="sidebar-sticky">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <img
          src={siteConfig.avatar}
          alt={siteConfig.author}
          className="w-44 h-44 rounded-full object-cover mb-4"
        />

        {/* Name */}
        <h2 className="text-2xl tracking-wide mb-1" style={{ fontWeight: 200, letterSpacing: '2px' }}>
          {firstName} <span className="font-semibold" style={{ letterSpacing: 0 }}>{lastName}</span>
        </h2>

        {siteConfig.authorAlternative && (
          <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--fg-heading)' }}>
            {siteConfig.authorAlternative}
          </h3>
        )}

        {/* Profession badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {siteConfig.professions.map((p) => (
            <span key={p} className="badge">{p}</span>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-2 mb-4">
          {siteConfig.social.map((s, i) => (
            <a
              key={`${s.name}-${i}`}
              href={s.url}
              target={s.url.startsWith('/') || s.url.startsWith('mailto:') ? undefined : '_blank'}
              rel={s.url.startsWith('/') || s.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-medium transition-colors"
              style={{
                background: 'var(--badge-bg)',
                color: 'var(--fg-heading)',
              }}
              title={s.name}
            >
              {socialIcons[s.icon] || s.name.slice(0, 2)}
            </a>
          ))}
        </div>

        {/* Contact info */}
        <div className="text-sm space-y-1" style={{ color: 'var(--fg-secondary)' }}>
          {siteConfig.location && (
            <div>{siteConfig.location}</div>
          )}
          {siteConfig.email && (
            <div>
              <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                {siteConfig.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
