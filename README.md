# cawley.dev

Personal website for Liam Cawley — built with Next.js, Tailwind CSS, and MDX.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Content

### New Blog Post

Create a folder in `content/posts/` with an `index.md`:

```
content/posts/my-new-post/
  index.md
```

Frontmatter:

```yaml
---
title: "My New Post"
tags: ["topic"]
date: 2025-01-01
excerpt: A short description.
---
```

### New Research Item

Create a folder in `content/research/` with an `index.md`:

```
content/research/my-project/
  index.md
```

Frontmatter:

```yaml
---
title: "Project Title"
tags: ["ml", "research"]
date: 2025-01-01
venue: Conference Name
authors:
  - name: "Liam Cawley"
excerpt: A short description.
selected: false
priority: 3
links:
  - name: "paper"
    url: "/research/my-project/paper.pdf"
  - name: "code"
    url: "https://github.com/..."
---
```

Put any PDFs in `public/research/my-project/`.

## Project Structure

```
├── content/          # Markdown content (posts & research)
├── public/           # Static assets (images, PDFs, favicon)
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   └── lib/          # Content parsing & MDX utilities
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## Site Config

Edit `src/lib/data.ts` to update personal info, experience, education, etc.

## Build & Deploy

```bash
npm run build    # Static export to out/
```

Deploy the `out/` directory to Netlify, Vercel, or any static host.

## Tech Stack

- **Next.js 14** — App Router, static export
- **Tailwind CSS** — Utility-first styling
- **MDX** — Markdown with LaTeX and code highlighting
- **Lucide** — Icons

## License

MIT
