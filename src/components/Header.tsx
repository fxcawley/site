'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Research', href: '/research' },
  { label: 'Posts', href: '/posts' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight hover:text-accent-600 transition-colors">
          Liam Cawley
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-accent-600 ${
                  pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                    ? 'text-accent-600'
                    : 'text-[rgb(var(--muted-foreground))]'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[rgb(var(--border))] bg-[rgb(var(--background))]">
          <ul className="flex flex-col px-6 py-4 gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm font-medium transition-colors ${
                    pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                      ? 'text-accent-600'
                      : 'text-[rgb(var(--muted-foreground))]'
                  }`}
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
