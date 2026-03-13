'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'About', href: '/' },
  { label: 'Experience', href: '/experience' },
  { label: 'Research', href: '/research' },
  { label: 'Posts', href: '/posts' },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 text-sm rounded transition-colors"
      style={{
        color: 'var(--fg-secondary)',
      }}
      aria-label="Toggle theme"
    >
      {dark ? '☀' : '☽'}
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--bg)' }}>
      <nav className="mx-auto max-w-6xl px-6 flex items-center justify-between h-14">
        {/* Desktop nav */}
        <ul className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  isActive(item.href)
                    ? 'font-semibold'
                    : ''
                }`}
                style={{
                  color: isActive(item.href) ? 'var(--bg)' : 'var(--fg)',
                  background: isActive(item.href) ? 'var(--accent)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            className="sm:hidden px-2 py-1 text-sm rounded"
            style={{ color: 'var(--fg)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? '\u2715' : '\u2630'}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden mx-auto max-w-6xl px-6 pb-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2 text-sm rounded transition-colors ${
                    isActive(item.href) ? 'font-semibold' : ''
                  }`}
                  style={{
                    color: isActive(item.href) ? 'var(--bg)' : 'var(--fg)',
                    background: isActive(item.href) ? 'var(--accent)' : 'transparent',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
