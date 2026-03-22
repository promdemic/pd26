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
bun --hot src/index.ts                # dev server with HMR
NODE_ENV=production bun src/index.ts  # production server
bun run build                         # production build to dist/
bun test                              # run tests
eslint                                # lint (JS/TS/CSS/Markdown, Prettier integrated)
```

From repo root:

```sh
bun run build   # build all packages
bun lint -w     # lint all packages
```

## Project

**Promdemic 2026** — a website for a high-school dance event at Port Gamble Bay. Core features:
- Student RSVP for the event (Friday May 15 – Saturday May 16, 2026)
- Parent volunteer sign-up with role-based capacity tracking

**Event Details:**
- Date: Friday May 15 – Saturday May 16, 2026
- Location: 30119 Gamble Pl NE, Kingston, WA 98346 (Port Gamble Bay)
- Transport: Edmonds Ferry → Kingston Shuttle → Venue
- Capacity: ~40–50 students + parent volunteers

## Architecture

Bun monorepo with packages in `packages/*`. The active package is `packages/web/`. The `packages/foo/` directory is an unused template and should be ignored.

**`packages/web/`** — Bun + React 19 + Tailwind CSS v4 + shadcn/ui

### Entry Points

- `src/index.ts` — Bun server entry (`Bun.serve()`). Serves `index.html` for all routes (`/*`). No API routes are implemented yet; add them to the `routes` object.
- `src/index.html` — HTML entry point, loads `frontend.tsx` as a module script. Bun bundles/transpiles automatically.
- `src/frontend.tsx` — React app entry, mounts `<App />` with HMR support via `import.meta.hot`.
- `src/App.tsx` — Root React component. Composes Nav, Hero, EventInfo, RSVPForm, VolunteerForm, Footer.

### Source Layout

```
packages/web/src/
├── index.ts             # Bun.serve() server
├── index.html           # HTML shell
├── index.css            # Imports globals.css
├── frontend.tsx         # React app entry (HMR)
├── App.tsx              # Root component with inline Nav
├── logo.svg
├── components/
│   ├── Hero.tsx         # Full-screen hero with CTA buttons
│   ├── EventInfo.tsx    # Schedule, directions, food, overnight info
│   ├── RSVPForm.tsx     # Student RSVP form (Phase 2: wire to Firestore)
│   ├── VolunteerForm.tsx # Parent volunteer signup (Phase 3: wire to Firebase)
│   ├── Footer.tsx       # Site footer
│   └── ui/              # shadcn/ui primitives (do not edit manually)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── lib/
│   ├── utils.ts         # cn() utility (clsx + tailwind-merge)
│   └── volunteers.ts    # VOLUNTEER_ROLES constant and VolunteerRole type
└── styles/
    └── globals.css      # Tailwind v4 config + coastal CSS variable palette
```

### Config Files

- `build.ts` — Production build script using `Bun.build()`. Bundles `src/index.html` to `dist/` with minification, sourcemaps, and `BUN_PUBLIC_*` env vars.
- `bunfig.toml` — Configures Tailwind plugin for dev server; exposes `BUN_PUBLIC_*` env vars to the frontend.
- `components.json` — shadcn/ui config. CSS path: `src/styles/globals.css`, icon library: lucide.
- `tsconfig.json` — Target ESNext, JSX react-jsx, strict mode, path alias `@/*` → `./src/*`.
- `eslint.config.js` — Lints JS/TS/JSX/TSX (typescript-eslint + react), CSS, Markdown; Prettier integrated via eslint-config-prettier.

## Conventions

### Path Alias

`@/*` maps to `src/*`. Always use this alias for imports within the package.

### Environment Variables

Frontend env vars **must** be prefixed with `BUN_PUBLIC_` to be accessible in the browser.

### Adding API Routes

Add handlers to the `routes` object in `src/index.ts`:

```ts
routes: {
  "/*": index,
  "/api/rsvp": { async POST(req) { /* ... */ } },
  "/api/volunteers/:id": async req => { /* ... */ },
}
```

### Adding shadcn/ui Components

Use `bunx shadcn@latest add <component>` from `packages/web/`. Do not manually edit files under `src/components/ui/`.

### Styling

- CSS variables are defined in `src/styles/globals.css` using Tailwind v4's `@theme` block.
- Coastal palette: `--navy` (#1a2744), `--teal` (#2a7f7f), `--sand` (#f5efe6), `--gold` (#c9a84c).
- Use the `cn()` helper from `@/lib/utils` to merge Tailwind classes.

### Volunteer Roles

Roles and slot counts are defined in `src/lib/volunteers.ts` as `VOLUNTEER_ROLES`. Update this file to change role names or capacities; VolunteerForm reads from it.

## Backend Status & Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | UI/UX (Hero, EventInfo, RSVPForm, VolunteerForm, Footer) | Complete |
| 2 | Wire RSVPForm to Firestore | Not started |
| 3 | Wire VolunteerForm to Firebase callable function | Not started |

Both forms currently simulate a 600 ms network delay on submit and log to the console. Volunteer slot data is mocked in `volunteers.ts`.

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react / react-dom | 19 | UI framework |
| tailwindcss | v4 | Utility-first CSS |
| bun-plugin-tailwind | 0.1.2 | Tailwind integration for Bun |
| lucide-react | 0.577.0 | Icon library |
| clsx | 2.1.1 | Conditional class names |
| tailwind-merge | 3.5.0 | Merge Tailwind classes without conflicts |
| class-variance-authority | 0.7.1 | shadcn/ui variant system |
