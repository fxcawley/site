# Project Notes

## Post Voice / Tone

The writing voice for blog posts should be:

- **Neutral and measured.** Write like a researcher speaks, not how a tech bro sells. Think Nick Bostrom in *Superintelligence* or Deborah Treisman reviewing fiction — observational, considered, willing to let the material carry itself.
- **Skeptical and allergic to overclaiming.** Hedge where honest. Don't oversell results or significance. If something is preliminary, say so. If a claim is contested, note it.
- **No punchy one-liners.** Avoid short declarative sentences used for rhetorical effect ("This won't last." "Things get ugly fast."). Prefer longer, more composed sentences that build complexity.
- **Minimal second-person direct address.** Don't open with "You want to..." or "Suppose you are...". The reader arrived on purpose; there is no need to hook them.
- **No fake authority.** Don't write as though you have hands-on experience in domains you don't (chip design, telecom engineering, etc.). It's fine to reference applications, but frame them as what they are — applications described in the literature, not personal experience.
- **Let the ideas do the work.** Trust the reader. If the math or the result is interesting, state it plainly. No need to announce that something is "remarkable" or "elegant" or "where things get interesting."

### Anti-patterns to avoid
- SF tech bro hype cadence (short → short → short → punchline)
- "Here's the thing:" / "The key insight:" / "This is where it gets interesting"
- Performing excitement about results
- Second-person hooks at paragraph openings
- Tripartite parallelism for emphasis ("Practically... Theoretically... Philosophically...")
- **Excessive em dashes.** Use them sparingly. Prefer commas, semicolons, parentheses, or separate sentences. One or two per post is fine; more than that reads as an AI tell.

## Thread System

Posts can be grouped into threads via frontmatter:
- `thread: "thread-id"` — groups posts
- `threadTitle: "Display Name"` — shown in UI (only needs to appear on one post)
- `threadOrder: 1` — ordering within the thread

## Build

- `npm run build` — full static build (Next.js 14, static export)
- Site deploys from `master` branch
