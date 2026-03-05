import type { Metadata } from 'next';
import { Mail, MapPin, Github, GraduationCap, FileText } from 'lucide-react';
import { siteConfig } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Contact</h1>
      <p className="text-[rgb(var(--muted-foreground))] mb-10">
        Feel free to reach out for collaborations or questions.
      </p>

      <div className="space-y-6">
        <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-50 dark:bg-accent-900/30 p-2.5 text-accent-600 dark:text-accent-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm text-[rgb(var(--muted-foreground))]">Email</p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-medium hover:text-accent-600 transition-colors"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-50 dark:bg-accent-900/30 p-2.5 text-accent-600 dark:text-accent-400">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-sm text-[rgb(var(--muted-foreground))]">Location</p>
              <p className="font-medium">{siteConfig.location}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h2 className="font-semibold mb-4">Links</h2>
          <div className="space-y-3">
            {siteConfig.social.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target={link.url.startsWith('/') ? undefined : '_blank'}
                rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                className="flex items-center gap-3 text-sm hover:text-accent-600 transition-colors"
              >
                {link.icon === 'github' && <Github size={16} />}
                {link.icon === 'graduation-cap' && <GraduationCap size={16} />}
                {link.icon === 'file-text' && <FileText size={16} />}
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
