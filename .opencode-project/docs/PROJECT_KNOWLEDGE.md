# HoloDesk — Project Knowledge

## Overview
HoloDesk is a Gather.town clone featuring fully customizable virtual spaces with proximity-based video chat, tile-based movement, and multiplayer networking. Originally built with Supabase, now migrated to a custom full-stack architecture using **NestJS + PostgreSQL + pgvector + Redis** with AI-ready infrastructure.

## Architecture

### Stack
- **Frontend**: React 19, Vite 5, TypeScript, TailwindCSS, Pixi.js, Socket.io-client, WebRTC, React Router v7
- **Backend**: NestJS, TypeScript, Socket.io, TypeORM, JWT Auth (httpOnly cookies)
- **Database**: PostgreSQL 15+ with pgvector extension
- **Cache/Realtime**: Redis (sessions, Socket.io adapter, game state caching)
- **AI Ready**: pgvector for embeddings, modular NestJS AI service stubs

### Monorepo Structure
```
HoloDesk/
├── .opencode-project/docs/       # Project documentation
├── backend/                       # NestJS API + Socket.io server
│   ├── src/
│   │   ├── auth/                  # JWT + Google OAuth (httpOnly cookie)
│   │   ├── users/                 # User management
│   │   ├── profiles/              # User profiles (skin, visited realms)
│   │   ├── realms/                # Space/realm CRUD + share links
│   │   ├── sessions/              # Game session engine (Redis-backed)
│   │   ├── socket/                # Socket.io gateway (multiplayer)
│   │   ├── ai/                    # AI service stubs (embeddings, search)
│   │   ├── config/                # Database & Redis configuration
│   │   └── common/                # Guards, pipes, decorators
│   ├── package.json
│   └── tsconfig.json
├── frontend/                      # React 19 + Vite SPA
│   ├── src/
│   │   ├── pages/                 # React Router pages
│   │   ├── components/            # Shared React components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── utils/
│   │   │   ├── api/               # Backend API client (replaces Supabase)
│   │   │   ├── pixi/              # Game engine types & helpers
│   │   │   └── auth/              # Auth context & helpers
│   │   └── App.tsx                # Root with Router
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Core Features
1. **Customizable Spaces** — Tile-based map editor with multiple rooms
2. **Proximity Video Chat** — WebRTC mesh video that activates when players are near each other, with screen sharing support
3. **Private Areas** — Rooms with dedicated channel IDs for group video chat
4. **Multiplayer Networking** — Socket.io real-time player movement and state sync
5. **Tile-based Movement** — Grid-based character movement with collision detection
6. **AI Ready** — pgvector extension for future semantic search, NPC embeddings, and content recommendations

## Authentication Flow (httpOnly Cookie)
1. User clicks "Sign in with Google" on frontend
2. Frontend navigates to `GET /auth/google` (NestJS OAuth endpoint)
3. Backend handles Google OAuth, creates/updates user, issues JWT in **httpOnly cookie**
4. Frontend fetches current user via `GET /auth/me` (cookie auto-sent)
5. All API calls use `credentials: 'include'` to send the httpOnly cookie
6. Socket.io connections authenticate via JWT passed in handshake `auth.token` header
7. Logout calls `POST /auth/logout` which clears the httpOnly cookie

## Game Session Engine
- In-memory `SessionManager` manages active realms and player state
- Redis used for:
  - Socket.io adapter (horizontal scaling)
  - Session persistence across server restarts
  - Player state caching
  - Rate limiting
- Maximum 30 players per realm
- Proximity detection within 3-tile radius

## Database Design
See `PROJECT_DATABASE.md`

## API Design
See `PROJECT_API.md`

## AI Integration Plan
- **pgvector**: Store realm descriptions, room content, and NPC dialogue embeddings
- **Redis**: Cache AI inference results and user context
- **NestJS AI Module**: Future OpenAI/Anthropic integration for:
  - Semantic realm search
  - AI NPCs with vector memory
  - Content generation (room descriptions, quests)
  - Recommendation engine for popular realms

## Environment Variables

### Backend (.env)
```
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=holodesk

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3001/api
VITE_BACKEND_URL=http://localhost:3001
VITE_BASE_URL=http://localhost:3000
```

## Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Deployment Notes
- PostgreSQL must have `pgvector` extension enabled: `CREATE EXTENSION vector;`
- Redis required for Socket.io adapter and session caching
- Backend serves both REST API and Socket.io on same port
