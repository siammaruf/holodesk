# AGENTS.md

## Project layout

Three independent projects in one repo — no monorepo tooling:

| Dir | Stack | Entry | Port | Alias |
|-----|-------|-------|------|-------|
| `backend/` | NestJS + PostgreSQL + Redis + Socket.io | `src/main.ts` | 3001 | — |
| `frontend/` | React 19 + Vite + Redux + TanStack Query | `app/main.tsx` | 3000 | `~/` → `app/` |
| `dashboard/` | React Router 7 (SSR) | `app/root.tsx` | 5173 | `~/` → `app/` |

Each project has its own `package.json`, `tsconfig.json`, and `node_modules`. Install and run commands separately per directory.

## Architecture Guides

Before working on any layer, read the relevant guide:

- **React/Frontend**: `.opencode/react/guides/` — file organization, routing, data fetching, component patterns
- **NestJS/Backend**: `.opencode/nestjs/guides/` — architecture, controllers, services, repositories, best practices

Key guides:
- `.opencode/react/guides/file-organization.md` — directory structure conventions
- `.opencode/react/guides/routing-guide.md` — routing patterns
- `.opencode/react/guides/data-fetching.md` — API service layer with Axios + TanStack Query
- `.opencode/nestjs/guides/BEST-PRACTICES.md` — NestJS coding standards
- `.opencode/nestjs/guides/BASE-CONTROLLER-GUIDE.md` — CRUD patterns

## Critical commands

### Install (run in each project dir)
```bash
cd backend && bun install
cd frontend && bun install
cd dashboard && npm install --legacy-peer-deps
```

Dashboard has a peer dependency resolution issue (`@react-router/dev`);
use `--legacy-peer-deps` with npm or `bun install` instead.

### Backend
```bash
# dev server (bun, not npm)
cd backend && bun run start:dev

# type-check
cd backend && npx tsc --noEmit

# lint
cd backend && npm run lint

# DB migrations
cd backend && npm run db:generate   # generate migration from entity changes
cd backend && npm run db:migrate    # run pending migrations

# build
cd backend && npm run build
```

The backend uses `bunx` for NestJS CLI commands (not `npx`).
Backend has `strictNullChecks: false` — don't rely on strict null analysis.

### Frontend (Vite SPA)
```bash
cd frontend && bun run dev
cd frontend && npx tsc --noEmit
# no lint script configured
```

**Frontend directory structure** follows `.opencode/react/guides/file-organization.md`:
- `app/pages/` — page components by route
- `app/components/ui/` — Shadcn/UI primitives
- `app/components/layout/` — layout components (Navbar, etc.)
- `app/hooks/` — custom React hooks
- `app/hooks/providers/` — context providers (Redux, TanStack Query)
- `app/lib/` — utility libraries (`cn()`, query client)
- `app/redux/` — Redux state management (store, slices, typed hooks)
- `app/routes/` — route definitions
- `app/services/` — API services
  - `services/httpService.ts` — Axios orchestrator
  - `services/httpMethods/` — HTTP method factories + interceptors
  - `services/httpServices/` — domain-specific services
- `app/styles/` — CSS files
- `app/types/` — TypeScript type definitions
- `app/utils/` — utility functions + validations

### Dashboard (React Router 7 SSR)
```bash
cd dashboard && npm run dev
cd dashboard && npm run typecheck    # runs react-router typegen → tsc
cd dashboard && npm run test:e2e     # Playwright
```

**Dashboard typegen is mandatory before type checking.** Running plain `tsc`
without `react-router typegen` first will fail on missing `+types/*` modules.
The `typecheck` script runs both in correct order:

```bash
cd dashboard && npm run typecheck
```

Do NOT run `npx tsc --noEmit` alone in `dashboard/`.

## Submodule

`.opencode/` is a git submodule (tracked in `.gitmodules`, pointing to
`https://github.com/CoFixer/opencode-workflow.git`). The `/commit` slash
command skips submodule changes — use `/commit-all` to include them.

Never commit `.gitmodules` (it's for local-only submodule reference).

## Project docs

`.opencode-project/docs/` contains:
- `PROJECT_KNOWLEDGE.md` — architecture & conventions
- `PROJECT_API.md` — backend API endpoints
- `PROJECT_DATABASE.md` — DB schema & entities
- `PROJECT_API_INTEGRATION.md` — frontend-backend integration status

Read the relevant doc before working on a layer.

## Auth

Backend uses JWT + httpOnly cookie auth (`cookie-parser`, Passport JWT strategy).
CORS is configured with `credentials: true`. Frontends use `axios` with
`withCredentials: true` (check `requestInterceptor.ts` in services/httpMethods/).\nEnv var: `VITE_API_URL` points to backend.

## Git workflow

Branch policy: never push directly to `main` or `dev`. Feature branches only.
PRs target `dev`. The `/commit` slash command handles the full workflow
(commit → push → PR → audit → merge).

## Gotchas

- `dashboard/` package.json name is `coffee-club-web`, not `holodesk-dashboard`.
- Backend `tsconfig` has non-strict settings (`strictNullChecks: false`,
  `noImplicitAny: false`).
- No CI/CD pipelines configured — local verification is the only guard.
- Backend has husky hooks in `backend/.husky/` but they only apply to commits
  made inside the backend directory (not root-level commits).
- Both React apps (`frontend/` and `dashboard/`) use `~/` alias pointing to `app/`.
- Frontend uses `react-router-dom` library mode with declarative routes in `App.tsx`;
  the `routes.ts` file exists for forward-compatibility with React Router 7 framework mode.
