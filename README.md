# Promdemic

A website for Promdemic — a dance for local teenagers held at a house on Port Gamble Bay in Port Gamble, WA.

## Features

- Student RSVP for the event
- Parent volunteer sign-up

## Tech Stack

- [Bun](https://bun.sh) — runtime, bundler, package manager
- [React 19](https://react.dev) — UI
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [shadcn/ui](https://ui.shadcn.com) — component library

## Getting Started

```sh
bun install
```

## Development

```sh
cd packages/web
bun --hot src/index.ts
```

The dev server runs with hot module reloading. Browser console logs are echoed to the terminal.

## Production

```sh
# Build
cd packages/web
bun run build

# Serve
NODE_ENV=production bun src/index.ts
```

Or from the repo root:

```sh
bun run build
```

## Project Structure

```
packages/
  web/
    src/
      index.ts        # Bun server (Bun.serve), API routes under /api/
      index.html      # HTML entry point
      frontend.tsx    # React app entry with HMR
      App.tsx         # Root React component
      components/ui/  # shadcn/ui components
      lib/utils.ts    # cn() utility
    build.ts          # Production build script
    bunfig.toml       # Bun config (Tailwind plugin, env vars)
```

Frontend environment variables must be prefixed with `BUN_PUBLIC_` to be accessible in the browser.
