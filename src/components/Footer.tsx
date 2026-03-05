import { Github, GraduationCap, FileText } from 'lucide-react';
import { siteConfig } from '@/lib/data';

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  github: Github,
  'graduation-cap': GraduationCap,
  'file-text': FileText,
};

export default function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))] mt-20">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[rgb(var(--muted-foreground))]">
          &copy; {new Date().getFullYear()} {siteConfig.author}
        </p>
        <div className="flex items-center gap-4">
          {siteConfig.social.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.url}
                href={link.url}
                target={link.url.startsWith('/') ? undefined : '_blank'}
                rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                className="text-[rgb(var(--muted-foreground))] hover:text-accent-600 transition-colors"
                title={link.name}
              >
                {Icon ? <Icon size={18} /> : <span className="text-sm">{link.name}</span>}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
