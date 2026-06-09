# Notification Backend

In-memory Express API for notifications.

## APIs

```text
POST   /api/notifications
GET    /api/notifications
GET    /api/notifications/unread
GET    /api/notifications/:id
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
```

Priority order: `placement > result > event`.

## Run

```bash
npm install
npm test
npm start
```

## Curl

```bash
curl -X POST http://localhost:4000/api/notifications -H "Content-Type: application/json" -d "{\"title\":\"Offer\",\"message\":\"Placed\",\"type\":\"placement\"}"
curl http://localhost:4000/api/notifications
curl http://localhost:4000/api/notifications/unread
curl http://localhost:4000/api/notifications/1
curl -X PATCH http://localhost:4000/api/notifications/1/read
curl -X PATCH http://localhost:4000/api/notifications/read-all
```
