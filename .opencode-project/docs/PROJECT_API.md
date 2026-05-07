# HoloDesk — API Specification

## Base URL
- Development: `http://localhost:3001`
- Production: `https://api.holodesk.app`

## Authentication
All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```
The JWT is obtained from the `/auth/google/callback` OAuth flow and stored in an httpOnly cookie.

## Socket.IO Authentication
Socket.io connections must include the JWT in the handshake headers:
```javascript
const socket = io(BACKEND_URL, {
  auth: { token: jwtToken },
  query: { uid: userId }
});
```

## REST Endpoints

### Authentication

#### `GET /auth/google`
Initiates Google OAuth flow.

**Response:** Redirects to Google consent screen.

---

#### `GET /auth/google/callback`
Google OAuth callback. Issues JWT cookie.

**Query:**
- `code` — Google authorization code

**Response:**
- Redirects to `FRONTEND_URL/app`
- Sets `access_token` httpOnly cookie

---

#### `GET /auth/me`
Returns current authenticated user.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "user",
  "avatar_url": "https://..."
}
```

---

#### `POST /auth/logout`
Clears authentication cookie.

**Response:** `204 No Content`

---

### Realms

#### `GET /realms`
List realms owned by the authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "My Space",
    "share_id": "uuid",
    "only_owner": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

#### `GET /realms/visited`
List realms the user has visited (via share links).

**Response:** Same shape as `/realms` with `shared: true` flag.

---

#### `POST /realms`
Create a new realm.

**Body:**
```json
{
  "name": "My New Space",
  "useDefaultMap": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My New Space",
  "share_id": "uuid",
  "map_data": { ... }
}
```

---

#### `GET /realms/:id`
Get a single realm by ID (owner access).

**Response:**
```json
{
  "id": "uuid",
  "name": "My Space",
  "owner_id": "uuid",
  "map_data": { ... },
  "share_id": "uuid",
  "only_owner": false
}
```

---

#### `GET /realms/by-share/:shareId`
Get a realm by share ID (public access if not private).

**Response:** Same as above, minus `share_id` for non-owners.

---

#### `PATCH /realms/:id`
Update realm data (owner only).

**Body:**
```json
{
  "name": "Updated Name",
  "only_owner": false,
  "map_data": { ... }
}
```

---

#### `DELETE /realms/:id`
Delete a realm (owner only).

**Response:** `204 No Content`

---

#### `POST /realms/:id/share`
Regenerate share link.

**Response:**
```json
{
  "share_id": "new-uuid"
}
```

---

### Profiles

#### `GET /profiles/me`
Get current user's profile.

**Response:**
```json
{
  "user_id": "uuid",
  "skin": "009",
  "visited_realm_ids": ["share-id-1", "share-id-2"]
}
```

---

#### `PATCH /profiles/me`
Update profile.

**Body:**
```json
{
  "skin": "012"
}
```

---

#### `POST /profiles/visited-realms`
Add a realm to visited list.

**Body:**
```json
{
  "shareId": "uuid"
}
```

---

### Game Session (HTTP Fallback)

#### `GET /sessions/players?roomIndex={n}`
Get players in a specific room (HTTP fallback for socket rooms).

**Response:**
```json
{
  "players": [
    {
      "uid": "uuid",
      "username": "player1",
      "x": 5,
      "y": 10,
      "room": 0,
      "skin": "009",
      "proximityId": "uuid"
    }
  ]
}
```

---

#### `GET /sessions/player-counts?realmIds=id1,id2`
Get active player counts for multiple realms.

**Response:**
```json
{
  "playerCounts": [12, 0, 5]
}
```

---

## Socket.IO Events

### Client → Server

#### `joinRealm`
Join a realm session.
```json
{
  "realmId": "uuid",
  "shareId": "uuid"
}
```

#### `movePlayer`
Move to a tile position.
```json
{
  "x": 10,
  "y": 15
}
```

#### `teleport`
Teleport to a different room.
```json
{
  "x": 5,
  "y": 5,
  "roomIndex": 2
}
```

#### `changedSkin`
Change character skin.
```json
"012"
```

#### `sendMessage`
Send a chat message.
```json
"Hello world!"
```

#### `disconnect`
Leave the realm (auto-fired on disconnect).

---

### Server → Client

#### `joinedRealm`
Successfully joined realm.

#### `failedToJoinRoom`
Failed to join (reason string).

#### `playerJoinedRoom`
Another player joined.
```json
{
  "uid": "uuid",
  "username": "player1",
  "x": 5,
  "y": 10,
  "room": 0,
  "socketId": "...",
  "skin": "009",
  "proximityId": null
}
```

#### `playerLeftRoom`
Player left.
```json
"uuid"
```

#### `playerMoved`
Player moved.
```json
{
  "uid": "uuid",
  "x": 6,
  "y": 15
}
```

#### `playerTeleported`
Player teleported.
```json
{
  "uid": "uuid",
  "x": 5,
  "y": 5
}
```

#### `proximityUpdate`
Proximity group changed (triggers WebRTC video group join/leave).
```json
{
  "proximityId": "uuid"
}
```

#### `playerChangedSkin`
Player changed skin.
```json
{
  "uid": "uuid",
  "skin": "012"
}
```

#### `receiveMessage`
Chat message received.
```json
{
  "uid": "uuid",
  "message": "Hello!"
}
```

#### `kicked`
Kicked from realm.
```json
"You have logged in from another location."
```

---

## AI Endpoints (Future)

#### `POST /ai/embed-realm`
Generate and store embeddings for a realm.

#### `POST /ai/search`
Semantic search across realms.
```json
{
  "query": "cozy forest cabin",
  "limit": 10
}
```

#### `GET /ai/realm-suggestions/:realmId`
Get AI-generated content suggestions for a realm.

---

## Error Responses
All errors follow this shape:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

Common status codes:
- `400` — Bad Request / Validation Error
- `401` — Unauthorized (invalid/missing JWT)
- `403` — Forbidden (not owner)
- `404` — Not Found
- `409` — Conflict
