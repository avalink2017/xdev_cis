# Xdev CIS — Project Context

## Stack
- **Angular 21** — standalone components, signals
- **Tailwind CSS 4** — via `@tailwindcss/postcss`
- **pnpm** — package manager
- **Vitest** — unit testing
- **tsx** — TypeScript executor for build scripts

## Project structure

```
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts          # CanActivate — redirects to /login
│   ├── layouts/
│   │   ├── external-layout/       # Public routes (login, register)
│   │   └── private-layout/        # Authenticated routes (sidebar + topbar)
│   ├── pages/
│   │   ├── external/              # Login, Register
│   │   └── private/               # Dashboard
│   ├── services/
│   │   ├── api.service.ts         # Generic CRUD via HttpClient
│   │   └── auth.service.ts        # AuthService — login, logout, user signal
│   ├── app.routes.ts              # Routes with lazy loading
│   ├── app.config.ts              # App providers
│   └── app.ts                     # Root component
├── environments/
│   ├── environment.ts             # Production (overwritten by set-env.ts)
│   └── environment.development.ts # Development (ng serve)
├── styles.css                     # Tailwind import
└── main.ts
```

## Routing

| Path | Layout | Page |
|---|---|---|
| `/login` | ExternalLayout | LoginPage |
| `/register` | ExternalLayout | RegisterPage |
| `/app` | PrivateLayout | DashboardPage |

All pages lazy-loaded via `loadComponent`.

## Environment variables (build-time)

- `API_URL` — backend base URL
- `API_KEY` — optional API key for headers

**Script:** `set-env.ts` (root) reads env vars and overwrites `src/environments/environment.ts` before `ng build`.

**Commands:**

| Script | Description |
|---|---|
| `npm start` | Dev server — uses `environment.development.ts` |
| `npm run build` | Production build — runs `set-env.ts` then `ng build --configuration production` |
| `npm run vercel-build` | Same as build, for Vercel |

## ApiService (`src/app/services/api.service.ts`)

Generic CRUD methods: `get<T>()`, `post<T>()`, `put<T>()`, `patch<T>()`, `delete<T>()`.

Injects `environment.apiUrl` as base URL and sends `x-api-key` header when `apiKey` is set.

## AuthService (`src/app/services/auth.service.ts`)

- `login(email, password)` — calls `POST auth/login`, stores token + user in localStorage
- `logout()` — calls `POST auth/logout`, clears storage, redirects to /login
- `user` signal — reactive current user (`User | null`), loaded from localStorage on init
- `isAuthenticated()` — checks if token and user exist

**User interface:** `{ id: number; name: string; email: string }`

## AuthGuard (`src/app/guards/auth.guard.ts`)

Functional `CanActivate` guard applied to the `/app` route. Redirects to `/login` if not authenticated.

## Pending / known issues

- No tests written for services or pages.
