/* Shared helpers for inline SVG figures.
   Colors use CSS variables so figures follow the site's light/dark theme.
   Fixed data colors are chosen to read on both card backgrounds. */

export const TEAL = '#14b8a6';
export const RED = '#ef4444';
export const AMBER = '#f59e0b';
export const VIOLET = '#8b5cf6';
export const SLATE = '#94a3b8';

export const svgStyle: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  display: 'block',
  margin: '1.75rem 0',
};

export function figureCss(root: string) {
  return `
    .${root} .panel { fill: var(--bg-card); stroke: var(--border); }
    .${root} .ttl { fill: var(--fg-heading); font-weight: 600; }
    .${root} .sub { fill: var(--fg); opacity: 0.72; }
    .${root} .lbl { fill: var(--fg); }
    .${root} .mut { fill: var(--fg-muted); }
    .${root} .track { fill: var(--surface); }
    .${root} .edge { stroke: var(--border); fill: none; }
    .${root} .flow { stroke: var(--fg-muted); fill: none; }
    .${root} text { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
  `;
}
