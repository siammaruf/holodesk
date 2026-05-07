# React Starter Kit

A production-ready React starter template with built-in authentication, user management, and dashboard functionality.

## Features

- **Authentication System** - Login, forgot password, OTP verification, password reset
- **User Management** - CRUD operations with search and pagination
- **Protected Routes** - Route guards with automatic redirects
- **Dashboard** - Admin dashboard with statistics and quick actions
- **State Management** - Redux Toolkit with async thunks
- **Type-safe Forms** - React Hook Form with Zod validation
- **Modern UI** - Shadcn/ui components with Tailwind CSS

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19, React Router 7 |
| Language | TypeScript 5.9 |
| State | Redux Toolkit, TanStack React Query |
| Forms | React Hook Form, Zod |
| Styling | Tailwind CSS, Shadcn/ui |
| HTTP | Axios (httpOnly cookie auth) |
| Testing | Playwright |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun

### Installation

```bash
npm install
# or
bun install
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

### Development

```bash
npm run dev
```

Application available at `http://localhost:5173`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | Run type checking |
| `npm run test:e2e` | Run E2E tests |

## Project Structure

```
app/
├── components/       # Reusable components
│   ├── layout/       # Header, sidebar, footer
│   ├── ui/           # Shadcn/ui components
│   └── auth/         # Auth components
├── pages/            # Page components
│   ├── auth/         # Login, forgot password, etc.
│   ├── dashboard/    # Admin dashboard pages
│   └── public/       # Public pages
├── routes/           # Route configurations
├── redux/            # Redux store and slices
├── services/         # API services and HTTP methods
├── hooks/            # Custom hooks and providers
├── types/            # TypeScript type definitions
├── utils/            # Utilities and validations
└── config/           # App configuration
```

## Building for Production

```bash
npm run build
```

## Deployment

### Docker

```bash
docker build -t react-starter-kit .
docker run -p 3000:3000 react-starter-kit
```

Deployable to AWS ECS, Google Cloud Run, Azure Container Apps, Fly.io, Railway, etc.
