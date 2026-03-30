# Promdemic 2026

A website for Promdemic — a dance for local teenagers held at a house on Port Gamble Bay, Kingston, WA (May 15–16, 2026).

## Features

- **Event schedule** — editable by admins in real time
- **Logistics info** — Getting There, Food & Fun, Overnight sections; editable by admins
- **Student RSVP** — sign in with Google, submit/update RSVP
- **Parent volunteer sign-up** — sign in with Google, pick a role; live slot counts

## Tech Stack

- [Bun](https://bun.sh) — runtime, bundler, package manager
- [React 19](https://react.dev) — UI
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [shadcn/ui](https://ui.shadcn.com) — component library
- [Firebase](https://firebase.google.com) — Firestore (data), Auth (Google Sign-In), Hosting (deploy)

## Project Structure

```sh
src/
  index.ts          # Bun.serve() server
  index.html        # HTML entry point
  frontend.tsx      # React app entry (HMR)
  App.tsx           # Root component
  components/       # React components
    ui/             # shadcn/ui primitives (do not edit manually)
  hooks/            # useAuth, useTimeline, useRsvp, useVolunteer
  lib/
    firebase.ts     # Firebase init + emulator connect
    schemas.ts      # Zod schemas for all Firestore collections
    volunteers.ts   # Role names and slot capacities
test/               # Firestore security rules tests
scripts/            # Seed scripts
build.ts            # Production build (Bun.build)
bunfig.toml         # Bun dev server config (Tailwind, env)
firestore.rules     # Firestore security rules
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values from the [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps → SDK config.

```sh
BUN_PUBLIC_FIREBASE_API_KEY=
BUN_PUBLIC_FIREBASE_AUTH_DOMAIN=
BUN_PUBLIC_FIREBASE_PROJECT_ID=
BUN_PUBLIC_FIREBASE_APP_ID=
```

All `BUN_PUBLIC_*` variables are inlined at build time by Bun. They must be set in CI (GitHub repo secrets) for production builds to work.

In development, the app automatically connects to the Firebase emulators instead of production — no real Firebase credentials are used during local dev.

## Development

**Prerequisites:** [Bun](https://bun.sh), [Firebase CLI](https://firebase.google.com/docs/cli) (`bun install -g firebase-tools`)

```sh
bun install

# Terminal 1 — Firebase emulators
bun run emulate

# Terminal 2 — dev server with HMR
bun run dev
```

The emulator UI is available at `http://localhost:4000`.

To seed the schedule and create a test admin account (`admin@test.local`) in the emulator:

```sh
bun run seed
```

## Testing

```sh
bun run test
```

Automatically starts the Firebase emulators, runs the Firestore security rules tests, then shuts the emulators down.

## Production Build & Deploy

```sh
bun run build    # outputs to dist/
bun run deploy   # firebase deploy (hosting + rules)
```

Requires `firebase login` and the `BUN_PUBLIC_*` env vars to be set.

## Admin Setup

Admins can edit the event schedule and logistics info directly on the page after signing in.

### Adding an admin (production)

1. Have the person sign in to the site with their Google account at least once (this creates their Firebase Auth account).
2. Find their UID in the [Firebase Console](https://console.firebase.google.com) → Authentication → Users.
3. In Firestore → Data, create a document at `admins/{uid}` with any content (e.g. `{ "email": "..." }`).

That's it — no code change needed.

### Adding an admin (emulator)

Run `bun run seed`. This creates `admin@test.local` in the Auth emulator and writes their `admins/{uid}` doc automatically. Sign in on the site using Google and enter that email when prompted.

### What admins can edit

Once signed in as an admin, hover over any editable section to reveal the pencil icon:

| Section | What you can edit |
|---|---|
| **Schedule** | Add, edit, or delete timeline entries (time + label); changes are live instantly |
| **Getting There** | Ferry info, shuttle info, venue address |
| **Food & Fun** | Dinner, dessert, and morning meal descriptions |
| **Overnight** | Overnight guest instructions |

All edits are saved to Firestore and reflected on the live site immediately.
