# API Integration

## Frontend-Backend Mapping

### Authentication Flow

*(Document login/register flow)*

### Data Flow

```
Frontend → API Client → Backend Controller → Service → Database
```

## State Management

*(Document how frontend manages API data: TanStack Query, Redux, Context, etc.)*

## Key Integrations

| Feature | Frontend | Backend Endpoint | Status |
|---------|----------|------------------|--------|
| Auth | `frontend/src/auth` | `/api/auth/*` | Not Started |
| | | | |

## Environment Configuration

| Variable | Frontend | Backend |
|----------|----------|---------|
| API_URL | `.env.local` | N/A |
| | | |
