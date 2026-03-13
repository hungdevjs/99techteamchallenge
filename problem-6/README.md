# Live Leaderboard Backend Service

[Excalidraw diagram](https://excalidraw.com/#json=XvIjdVppHSELXPDJJF4fc,YEhfd8X8l9Ne6Mo_Piajmw)

This module implements the backend API service responsible for:

- Handling user actions
- Updating user scores
- Maintaining a Top 10 leaderboard
- Broadcasting real-time leaderboard updates to connected clients

The system is designed to support **real-time updates**, **high concurrency**, and **secure score modification**.

---

# Goals

The service must:

1. Maintain a **Top 10 leaderboard**
2. Update scores when users perform actions
3. Push **live updates** to connected clients
4. Prevent **unauthorized score manipulation**
5. Guarantee **reliable event processing**

---

# Architecture Overview

### Main components:

1. Client
2. API Server
3. Auth Middleware
4. Action Service
5. Database
6. Outbox Pattern
7. Outbox Watcher
8. User Service
9. Redis Leaderboard
10. RabbitMQ
11. Leaderboard Service
12. SSE Clients

### System uses:

- **Database (PostgreSQL, MongoDB,...)** → source of truth
- **Redis Sorted Set** → fast leaderboard
- **RabbitMQ** → event communication
- **SSE (Server Sent Events)** → real-time client updates
- **Outbox Pattern** → reliable event processing

---

# Execution Flow

## 1. Client connects to leaderboard stream

Clients establish a **Server Sent Events connection**.

```
GET /events/leaderboard
Content-Type: text/event-stream
Connection: keep-alive
```

The server stores the SSE connection in memory.

`clients[]`

These connections will receive leaderboard updates.

---

## 2. User performs an action

Client triggers:

```
POST /actions/:xyz
Authorization: Bearer <token>
```

Flow:

`Client
→ Auth Middleware
→ Action Service
→ Database`

---

## 3. Authorization

The Auth Middleware validates:

- JWT token
- user identity
- request authenticity

Invalid requests return:

```
401 Unauthorized
403 Forbidden
```

---

## 4. Update Score (Atomic Transaction)

The Action Service performs (example with SQL):

```
BEGIN TRANSACTION

UPDATE users
SET score = score + :scoreIncrement

INSERT INTO outbox
(userId, action, scoreChanged, status)

COMMIT
```

This guarantees:

- score update
- event creation

are **atomic**.

---

# Database Schema Example

## users

| column   | type    |
| -------- | ------- |
| id       | uuid    |
| username | text    |
| score    | integer |

---

## outbox

Stores events waiting to be processed.

| column       | type                         |
| ------------ | ---------------------------- |
| id           | uuid                         |
| userId       | uuid                         |
| action       | text                         |
| scoreChanged | integer                      |
| status       | enum ('pending','processed') |

---

# Outbox Processing

An **Outbox Watcher** continuously monitors new outbox entries.

Flow:

`Outbox Watcher
→ read pending outbox events
→ call User Service`

If watcher misses events, a fallback **cron job** runs periodically:

every X minutes

to process long pending events.

---

# User Service

User Service processes the score update in Redis.

Steps:

1. Increment user score in Redis leaderboard

ZINCRBY leaderboard scoreDelta username

2. Mark outbox record as processed.

3. If the user's new score **enters the Top 10**, publish event.

`publish → RabbitMQ queue
user-score-changed`

---

# Redis Leaderboard

Leaderboard stored as:

`Sorted Set
key: leaderboard`

Example:

```
ZINCRBY leaderboard 5 alice
ZREVRANGE leaderboard 0 9 WITHSCORES
```

---

# RabbitMQ

Queue name:

`user-score-changed`

This event indicates:

Leaderboard might have changed

---

# Leaderboard Service

Consumes events from RabbitMQ.

Steps:

1. Fetch Top 10 from Redis

`ZREVRANGE leaderboard 0 9 WITHSCORES`

2. Compare with cached Top 10

`lastTop10[]`

3. If changed

broadcast new leaderboard

4. Apply **debounce** to avoid excessive broadcasts.

---

# SSE Broadcast

When leaderboard changes:

`for client in clients:
send leaderboard-update`

Example event:

```
event: leaderboard-update
data: {
    "top10": [
        { "username": "alice","score": 120 },
        { "username": "bob","score": 100 }
    ]
}
```

---

# SSE Connection Management

Connections stored in memory:

`clients[]`

Each entry contains:

```
connection
userId
lastHeartbeat
```

Disconnected clients must be removed.

---

# Security

### 1. Server Controls Score Updates

Client **cannot send score values**.

Score increments are determined by server logic.

---

### 2. Authentication Required

All action endpoints require:

`Authorization: Bearer JWT`

---

### 3. Rate Limiting

Prevents action spam.

---

### 4. Authorization Validation

Middleware ensures requests are not forged.

---

# Failure Handling

### Outbox Pattern

Ensures events are not lost even if:

- server crashes
- queue unavailable

---

### Retry Mechanism

Cron job scans:

`outbox.status = pending`

and retries processing.

---

# Notes for backend

### Reason of choosing SSE over websocket:

- SSE is simpler
- we dont need to emit event from client → server in this case
- **note**:
  - SSE might not work for old browsers, if we target these part we can switch to websocket
  - if we want to ship faster and we dont have so many users looking at leaderboard at a time, **firebase firestore** can also be a good option and worth a try to reduce stress on our server

### Queue alternative

- In case we are using multiple server instances, we might need to switch to redis pub/sub to ensure all instances can receive leaderboard-updated event and broadcast to their own SSE/websocket connections

### Outbox patern

- Outbox pattern is applied in this case to ensure there is no mismatch between database and redis, there is always a chance of server crash/network drop/... and outbox pattern will cover all of these cases, and top 10 data will be broadcast to player immediately or in X minutes by latest (when cronjob runs)
- I design this architecture/flow to allow anything can fail at anytime and we still can recover it all

### Backend security

- Backend security is important here, we need auth middleware to validate requests, we need transaction to update user score and we may also need redis lock, idempotency,... when design APIs to prevent race conditions, replay attacks,... logging is also a part we need to take care of, logs should contains enough information for us to track later
