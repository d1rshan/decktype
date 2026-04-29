# decktype

a typing playground, not a typing test.

monkeytype nailed the typing test. decktype asks what comes after that — what if the keyboard was a playground instead of a benchmark?

timed chaos modes, rhythm-based typing, and mechanics you've genuinely never seen on a typing site before. open source, forkable, and weird by design.

## stack

- **frontend** — SolidJS + Vite, deployed to Cloudflare Pages
- **backend** — ElysiaJS + Bun, deployed to Vercel
- **shared** — `packages/api` for shared types and API client

## structure

```
decktype/
├── apps/
│   ├── frontend/   # SolidJS app
│   └── backend/    # ElysiaJS API
└── packages/
    └── api/        # shared types
```

## getting started

```bash
# install dependencies
bun install

# run frontend
cd apps/frontend && bun dev

# run backend
cd apps/backend && bun dev
```

## contributing

fork it, break it, ship your strange idea into it. PRs welcome.

## license

MIT
