# HoloDesk — Database Schema (PostgreSQL + pgvector)

## Extensions Required
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
```

## Tables

### `users`
Core user accounts (replaces Supabase Auth users).

| Column       | Type        | Constraints          | Description                    |
|--------------|-------------|----------------------|--------------------------------|
| id           | UUID        | PRIMARY KEY          | Auto-generated UUID            |
| email        | VARCHAR(255)| UNIQUE, NOT NULL     | Google OAuth email             |
| username     | VARCHAR(100)| NOT NULL             | Derived from email prefix      |
| avatar_url   | TEXT        | NULL                 | Google profile picture         |
| google_id    | VARCHAR(255)| UNIQUE, NULL         | Google sub/ID                  |
| created_at   | TIMESTAMPTZ | DEFAULT now()        | Account creation               |
| updated_at   | TIMESTAMPTZ | DEFAULT now()        | Last update                    |

### `profiles`
Extended user profile data (1:1 with users).

| Column            | Type        | Constraints          | Description                    |
|-------------------|-------------|----------------------|--------------------------------|
| user_id           | UUID        | PRIMARY KEY, FK→users| One profile per user           |
| skin              | VARCHAR(10) | DEFAULT '009'        | Character skin ID              |
| visited_realm_ids | TEXT[]      | DEFAULT '{}'         | Array of visited realm share_ids|
| created_at        | TIMESTAMPTZ | DEFAULT now()        | Profile creation               |
| updated_at        | TIMESTAMPTZ | DEFAULT now()        | Last update                    |

### `realms`
Virtual spaces/maps created by users.

| Column       | Type        | Constraints          | Description                    |
|--------------|-------------|----------------------|--------------------------------|
| id           | UUID        | PRIMARY KEY          | Auto-generated UUID            |
| owner_id     | UUID        | NOT NULL, FK→users   | Creator of the realm           |
| name         | VARCHAR(100)| NOT NULL             | Display name                   |
| share_id     | UUID        | UNIQUE, NOT NULL     | Share link token               |
| map_data     | JSONB       | NOT NULL             | Tilemap, rooms, spawnpoints    |
| only_owner   | BOOLEAN     | DEFAULT false        | Private realm flag             |
| created_at   | TIMESTAMPTZ | DEFAULT now()        | Creation time                  |
| updated_at   | TIMESTAMPTZ | DEFAULT now()        | Last update                    |

Indexes:
- `idx_realms_owner_id` on `owner_id`
- `idx_realms_share_id` on `share_id`
- GIN index on `map_data` for JSONB queries

### `realm_embeddings` (AI Ready)
Vector embeddings for semantic search and AI features.

| Column       | Type        | Constraints          | Description                    |
|--------------|-------------|----------------------|--------------------------------|
| id           | UUID        | PRIMARY KEY          | Auto-generated UUID            |
| realm_id     | UUID        | NOT NULL, FK→realms  | Linked realm                   |
| content_type | VARCHAR(50) | NOT NULL             | 'description', 'room', 'npc'   |
| content      | TEXT        | NOT NULL             | Source text for embedding      |
| embedding    | vector(1536)| NOT NULL             | OpenAI text-embedding-3-small  |
| created_at   | TIMESTAMPTZ | DEFAULT now()        | Creation time                  |

Indexes:
- `idx_embeddings_realm_id` on `realm_id`
- IVFFlat index on `embedding` for similarity search

## Entity Relationship Diagram
```
users ||--o{ realms : owns
users ||--|| profiles : has
realms ||--o{ realm_embeddings : has
```

## TypeORM Entities
Located in `backend/src/` under respective modules:
- `users/entities/user.entity.ts`
- `profiles/entities/profile.entity.ts`
- `realms/entities/realm.entity.ts`
- `ai/entities/realm-embedding.entity.ts`

## Data Migrations
All migrations are managed via TypeORM CLI:
```bash
cd backend
npx typeorm migration:generate -d ./dist/config/data-source.js src/migrations/InitialSchema
npx typeorm migration:run -d ./dist/config/data-source.js
```

## JSONB Schema for `map_data`
```typescript
interface RealmData {
  spawnpoint: {
    roomIndex: number;
    x: number;
    y: number;
  };
  rooms: Room[];
}

interface Room {
  name: string;
  tilemap: {
    [key: `${number}, ${number}`]: {
      floor?: string;
      above_floor?: string;
      object?: string;
      impassable?: boolean;
      teleporter?: {
        roomIndex: number;
        x: number;
        y: number;
      };
    };
  };
  channelId?: string;
}
```

## Redis Key Patterns
- `session:{realmId}` — Serialized active session data
- `player:{uid}` — Player state hash (socketId, realmId, room, x, y)
- `socket:{socketId}` → `uid` mapping
- `realm_players:{realmId}` — Set of active player UIDs
- `rate_limit:{ip}` — API rate limiting counters
