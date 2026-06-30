# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

P&P Demo is a full-stack Next.js app demonstrating phone-and-PIN multi-factor authentication. Users log in via the web with a password, then authenticate a second factor over a Twilio phone call by speaking a safe word and entering a PIN. The `/demo/*` routes simulate what this looks like embedded in a fictional banking app UI.

## Commands

```bash
npm run dev          # Start Next.js dev server on http://localhost:3000
npm run dev:ngrok    # Expose port 3000 via ngrok (required for Twilio webhooks)
npm run build        # prisma generate + next build
npm run lint         # ESLint via next lint
npx prisma migrate dev --name <name>   # Apply schema changes to DB
npx prisma db push                      # Overwrite DB with current schema
npx prisma studio                       # Browse DB in the browser
```

## Required environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase pooled connection string (Prisma) |
| `DIRECT_URL` | Supabase direct connection string (Prisma migrations) |
| `ACCESS_SECRET` | HS256 secret for JWT access tokens (1 hour) |
| `REFRESH_SECRET` | HS256 secret for JWT refresh tokens (30 days) |
| `ENCRYPTION_KEY` | 32-byte hex key for AES-256-GCM encryption |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER_<CC>` | Twilio number per country code, e.g. `TWILIO_PHONE_NUMBER_US` |
| `BASE_URL` | Publicly accessible base URL (ngrok forwarding URL in dev) — Twilio posts webhooks here |

## Architecture

### Route layout

- `/` — public homepage
- `/user/*` — real authenticated app (signup, login, home, profile, logout)
- `/demo/*` — demo "banking app" UI (demoLogin does no real auth, just redirects)
- `/admin/users` — admin user management
- `/api/voice/*` — Twilio webhook endpoints (must be publicly reachable)

### Auth system (`src/utils/auth.ts`, `src/utils/userActions.ts`, `src/middleware.ts`)

JWT-based dual-token auth with `jose`:
- **Access token** (`auth` cookie): 1-hour expiry, HS256 signed with `ACCESS_SECRET`
- **Refresh token** (`refresh` cookie): 30-day expiry, HS256 signed with `REFRESH_SECRET`
- Both cookies store the token as JSON: `{ "value": "<jwt>" }`
- Middleware runs on all non-static, non-API routes. It validates the access token; if expired, refreshes both tokens from the refresh cookie; if both expired, deletes cookies and sets a `user-id` cookie for the client to trigger auto-logout.
- `LoggedInContext` (`src/context/loggedIn.tsx`) watches the `user-id` cookie client-side and calls `logout()` to mark the user as logged-out in the DB and redirect to login.
- For server components, use `getUserSession()`. For client components, use the `useLoggedIn()` hook.

JWT payload shape (`JWTPayload` in `src/lib/schemata.ts`): `{ userId, username, role }`.

### Data encryption (`src/utils/encrypt-decrypt.ts`)

Phone numbers, safe words, and PINs are encrypted at rest with AES-256-GCM before being stored in the DB. Passwords are bcrypt-hashed. Never store these values in plaintext.

### Twilio voice auth flow (`src/utils/voice.ts`, `src/app/api/voice/*`)

1. `initiateCall()` in `src/utils/voice.ts` creates a Twilio call pointing to `BASE_URL/api/voice/voice-entry` (demo login) or `BASE_URL/api/voice/register-creds` (first-time setup).
2. Twilio posts to the voice API routes, which return TwiML XML responses.
3. Auth flow: `voice-entry` → gather safe word speech → `validate-safeword` → gather PIN keypad input → `validate-pin` → complete login.
4. Registration flow: `register-creds` → `record-safeword` → `record-pin`.
5. The call SID is used to look up the user in the `VoiceCall` table throughout the flow.
6. `call-limiter.ts` enforces a 30-second cooldown per user (in-memory Map, cleared on logout).

### Prisma (`prisma/schema.prisma`)

Generated client outputs to `src/generated/prisma` (not the default location). Import from `@/generated/prisma`.

The singleton Prisma client is at `src/utils/db.ts` — always import from there.

Models: `User` (credentials + encrypted phone/safeword/pin, `loggedIn` flag) and `VoiceCall` (linked to `User`, stores Twilio `callSid` and `status`).

### Demo mode (`src/utils/demoActions.ts`)

`demoLogin` validates credentials against the DB but sets no auth cookies — it simply redirects to `/demo/register-creds` (if no safeword/PIN) or `/demo/start`. Demo routes sit inside a different visual layout (no persistent navbar; a drawer trigger appears instead).

### Layout (`src/components/ui/split-layout.tsx`)

`SplitLayout` wraps all pages via `src/app/layout.tsx`. It renders a persistent top navbar on non-demo routes and a bottom drawer trigger on `/demo/*` routes. The `DemoHeader` component is shown on all non-root pages.

### Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).
