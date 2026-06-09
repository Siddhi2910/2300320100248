# Notification System Design

## Stage 1

### Functional Requirements

- Create notifications with `title`, `message`, and `type`.
- Retrieve all notifications.
- Retrieve unread notifications.
- Retrieve notification by id.
- Mark one notification as read.
- Mark all notifications as read.
- Sort by priority: `placement > result > event`.

### Non-Functional Requirements

- Low-latency reads for user-facing notification lists.
- Reliable writes without duplicate delivery where possible.
- Clear validation and error responses.
- Centralized structured logging.
- Simple horizontal scalability path.

### API Design

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/notifications` | Create notification |
| `GET` | `/api/notifications` | Get all notifications |
| `GET` | `/api/notifications/unread` | Get unread notifications |
| `GET` | `/api/notifications/:id` | Get by id |
| `PATCH` | `/api/notifications/:id/read` | Mark one read |
| `PATCH` | `/api/notifications/read-all` | Mark all read |

Example create body:

```json
{
  "title": "Placement Update",
  "message": "You were placed in round 1",
  "type": "placement"
}
```

### Real-Time Notification Strategy

- Current implementation supports REST polling.
- For real time, add WebSocket or Server-Sent Events.
- REST remains source of truth; real-time channel only pushes delivery hints.
- Clients should refetch unread notifications after reconnect.

## Stage 2

### Database Selection

Use PostgreSQL for production.

### Justification

- Notifications are relational and query-heavy by `userId`, `read`, `type`, and `createdAt`.
- PostgreSQL gives transactions, indexes, JSON support, and predictable operations.
- In-memory storage is acceptable only for assessment/demo scope.

### Data Model

```text
Notification
- id
- userId
- title
- message
- type
- read
- createdAt
- readAt
```

### Schema Design

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('placement', 'result', 'event')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);
```

### Indexing Strategy

```sql
CREATE INDEX idx_notifications_user_created
  ON notifications (user_id, created_at DESC);

CREATE INDEX idx_notifications_user_unread
  ON notifications (user_id, read, created_at DESC);

CREATE INDEX idx_notifications_user_type_created
  ON notifications (user_id, type, created_at DESC);
```

## Stage 3

### Query Analysis

| Query | Access Pattern |
| --- | --- |
| Get all | `userId`, ordered by priority and time |
| Get unread | `userId`, `read=false` |
| Get by id | primary key |
| Mark read | primary key update |
| Mark all read | bulk update by `userId` and `read=false` |

### Bottleneck Identification

- Large unread scans without indexes.
- Sorting large user notification history.
- Bulk `mark all read` updates for high-volume users.
- Real-time fanout during traffic spikes.

### Query Optimization Strategy

- Always filter by `userId`.
- Paginate list endpoints.
- Use unread index for unread count/list.
- Store priority rank as computed value if sorting becomes expensive.
- Archive old notifications to reduce hot table size.

## Stage 4

### Scaling Strategy

- Run stateless Express instances behind a load balancer.
- Use shared PostgreSQL storage.
- Add read replicas for heavy read traffic.
- Partition by time or tenant/user segment if table growth is high.

### Caching Strategy

- Cache unread count per user in Redis.
- Cache first page of notifications for short TTL.
- Invalidate cache on create, mark read, and mark all read.

### Performance Improvements

- Add pagination: `limit`, `cursor`.
- Avoid returning unlimited notification history.
- Batch writes from async workers.
- Compress responses if payloads grow.
- Use connection pooling.

## Stage 5

### High-Volume Notification Architecture

```text
Producer Service -> Queue -> Notification Worker -> PostgreSQL -> REST API
                                           |
                                           -> WebSocket/SSE Fanout
```

### Queue-Based Processing

- Producers publish notification jobs to a queue.
- Workers validate, persist, and emit delivery events.
- Queue decouples traffic spikes from database writes.

### Retry Mechanism

- Retry transient failures with exponential backoff.
- Keep idempotency key to prevent duplicate notifications.
- Cap retry attempts to avoid infinite loops.

### Failure Recovery

- Persist jobs until acknowledged.
- Workers acknowledge only after successful DB write.
- Reprocess unacknowledged jobs after worker crash.
- Use logs and metrics to detect failure patterns.

### Dead-Letter Queue Strategy

- Move permanently failing jobs to DLQ after max retries.
- Store failure reason, payload, and timestamp.
- Provide manual replay after fixing bad data or downstream issues.

## Stage 6

### Priority Rules

| Type | Rank |
| --- | --- |
| `placement` | 3 |
| `result` | 2 |
| `event` | 1 |

### Notification Ranking Algorithm

1. Map notification type to rank.
2. Sort by rank descending.
3. For same rank, sort by `createdAt` descending.

### Sorting Strategy

Current implementation sorts in application memory. Production can use SQL:

```sql
ORDER BY
  CASE type
    WHEN 'placement' THEN 3
    WHEN 'result' THEN 2
    WHEN 'event' THEN 1
  END DESC,
  created_at DESC;
```

### Time Complexity Analysis

- In-memory sorting: `O(n log n)` time, `O(n)` space.
- Indexed DB filtering: approximately `O(log n + k)` for matching rows.
- Mark one read: `O(1)` by primary key.
- Mark all read: `O(k)` for unread rows of a user.

### Edge Cases

- Missing `title`, `message`, or `type`.
- Invalid type.
- Invalid notification id.
- Notification not found.
- Empty notification list.
- Duplicate delivery from retries.
- Clock skew in distributed systems.
- Large notification history requiring pagination.
