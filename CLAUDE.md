# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tooling

Default to using Bun instead of Node.js.

- `bun <file>` instead of `node` or `ts-node`
- `bun test` instead of jest or vitest
- `bun install` instead of npm/yarn/pnpm install
- `bun run <script>` instead of npm/yarn run
- `bunx <package>` instead of npx
- Bun automatically loads `.env` — no dotenv needed
- `Bun.serve()` instead of express; `bun:sqlite` instead of better-sqlite3; `Bun.sql` for Postgres; `Bun.file` instead of fs readFile/writeFile

## Commands

From `packages/web/`:

```sh
bun --hot src/index.ts      # dev server with HMR
NODE_ENV=production bun src/index.ts  # production server
bun run build               # production build to dist/
bun test                    # run tests
eslint                      # lint (JS/TS/CSS/Markdown, Prettier integrated)
```

From repo root:

```sh
bun run build               # build all packages
bun lint -w                 # lint all packages
```

## Project

**Promdemic** — a website for a high-school dance. Core features:
- Student RSVP for the event
- Parent volunteer sign-up

## Architecture

Bun monorepo with a single package at `packages/web/`.

**`packages/web/`** — Bun + React 19 + Tailwind CSS v4 + shadcn/ui

- `src/index.ts` — Bun server entry (`Bun.serve()`). Serves `index.html` for all routes (`/*`) and defines API routes under `/api/`.
- `src/index.html` — HTML entry point, loads `frontend.tsx` as a module script. Bun bundles/transpiles automatically.
- `src/frontend.tsx` — React app entry, mounts `<App />` with HMR support via `import.meta.hot`.
- `src/App.tsx` — Root React component.
- `src/components/ui/` — shadcn/ui components (button, card, input, label, select, textarea).
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge).
- `build.ts` — Production build script using `Bun.build()`. Bundles `src/index.html` to `dist/` with minification, sourcemaps, and `BUN_PUBLIC_*` env vars.
- `bunfig.toml` — Configures Tailwind plugin for dev server static serving; exposes `BUN_PUBLIC_*` env vars to the frontend.

**Path alias:** `@/*` maps to `src/*`.

**Frontend env vars** must be prefixed with `BUN_PUBLIC_` to be accessible in the browser.

**Adding API routes:** Add handlers to the `routes` object in `src/index.ts`. Pattern: `"/api/path": { GET(req) { ... } }` or `"/api/path/:param": async req => { ... }`.
