# My Portfolio Landing Page 

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Learning section (`/learning`)

Built from my Obsidian vault. The vault is only read, never changed.

```bash
bun run learning   # reads VAULT_DIR (.env.local) or clones VAULT_REPO, writes src/server/learning-*.json
```

Commit the regenerated JSON and deploy. Keep a note private with `publish: false` in its frontmatter, or add it to `EXCLUDE` in `scripts/learning.ts`.
