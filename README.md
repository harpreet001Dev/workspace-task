# Mini SaaS Project Management Tool

A Trello + Notion + Slack inspired collaboration app, built as a Senior Full
Stack Developer assignment. Supports workspaces, boards, columns, tasks,
attachments, real-time updates, and role-based access control.

## Tech stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), Redis, BullMQ, Socket.io
- **Auth:** JWT (access + refresh tokens), RBAC
- **Frontend:** React + Vite, Redux Toolkit / Zustand, React Hook Form
- **DevOps:** Docker, Docker Compose, GitHub Actions, Swagger/OpenAPI

## Features

- JWT authentication with refresh token rotation
- Role-based access control at workspace and board level
- Workspaces → Boards → Columns → Tasks hierarchy
- Task attachments, priorities, and audit logging
- Real-time updates via Socket.io
- Background jobs via BullMQ, caching via Redis
- Swagger-documented REST API

## Architecture diagram

All services run as separate Docker containers, orchestrated via Docker Compose.

                         ┌──────────────────────┐
                         │        USER          │
                         │   Browser / Client   │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / HTTPS
                                    ▼
                    ┌─────────────────────────────┐
                    │          FRONTEND           │
                    │       React Application     │
                    │                             │
                    │  Pages / Components / API   │
                    └─────────────┬───────────────┘
                                  │
                                  │ REST API
                                  ▼
                    ┌─────────────────────────────┐
                    │          BACKEND            │
                    │      Node.js + Express      │
                    │                             │
                    │ ┌─────────────────────────┐ │
                    │ │ Routes                  │ │
                    │ │ Controllers             │ │
                    │ │ Middleware              │ │
                    │ │ Services                │ │
                    │ │ Authentication          │ │
                    │ └────────────┬────────────┘ │
                    └──────────────┼──────────────┘
                                   │
                                   │ Mongoose
                                   ▼
                    ┌─────────────────────────────┐
                    │          DATABASE           │
                    │           MongoDB           │
                    │                             │
                    │ Users / Teams / Projects    │
                    │ Tasks / etc.                │
                    └─────────────────────────────┘


             ┌─────────────────────────────────────────┐
             │              DEVELOPMENT                │
             │                                         │
             │ Git Repository                          │
             │          │                              │
             │          ▼                              │
             │    GitHub Actions                       │
             │          │                              │
             │     ┌────┴─────┐                        │
             │     │          │                        │
             │     ▼          ▼                        │
             │ Backend CI   Frontend CI                 │
             │     │          │                        │
             │     └────┬─────┘                        │
             │          ▼                              │
             │     Tests / Build                       │
             └─────────────────────────────────────────┘


                    ┌─────────────────────────┐
                    │         DOCKER          │
                    │                         │
                    │  Backend Container      │
                    │          │              │
                    │          ▼              │
                    │  MongoDB Container      │
                    │                         │
                    │   docker-compose.yml    │
                    └─────────────────────────┘


```mermaid
flowchart TB
  subgraph Compose["Docker Compose network"]
    Frontend["Frontend<br/>React + Nginx"]
    API["Backend API<br/>Express + Socket.io"]
    Worker["Worker<br/>BullMQ processor"]
    Redis["Redis<br/>Cache + job queue"]
    Mongo["MongoDB<br/>Primary database"]
  end

  Frontend --> API
  API --> Redis
  API --> Mongo
  Worker --> Redis
  Worker --> Mongo
```

## ER diagram

```mermaid
erDiagram
  USER ||--o{ REFRESH_TOKEN : owns
  USER ||--o{ WORKSPACE : owns
  USER ||--o{ WORKSPACE_MEMBER : has
  WORKSPACE ||--o{ WORKSPACE_MEMBER : contains
  WORKSPACE ||--o{ WORKSPACE_INVITE : has
  USER ||--o{ WORKSPACE_INVITE : sends
  WORKSPACE ||--o{ BOARD : contains
  USER ||--o{ BOARD : creates
  BOARD ||--o{ BOARD_MEMBER : has
  USER ||--o{ BOARD_MEMBER : has
  BOARD ||--o{ COLUMN : contains
  BOARD ||--o{ TASK : contains
  COLUMN ||--o{ TASK : contains
  USER ||--o{ TASK : creates
  USER ||--o{ TASK : assigned_to
  TASK ||--o{ ATTACHMENT : has
  USER ||--o{ ATTACHMENT : uploads
  WORKSPACE ||--o{ AUDIT_LOG : logs
  USER ||--o{ AUDIT_LOG : performs

  USER {
    ObjectId _id PK
    string name
    string email UK
    string password
  }
  REFRESH_TOKEN {
    ObjectId _id PK
    ObjectId userId FK
    string token
    date expiresAt
    boolean isRevoked
  }
  WORKSPACE {
    ObjectId _id PK
    string name
    string description
    ObjectId ownerId FK
  }
  WORKSPACE_MEMBER {
    ObjectId _id PK
    ObjectId userId FK
    ObjectId workspaceId FK
    string role
  }
  WORKSPACE_INVITE {
    ObjectId _id PK
    ObjectId workspaceId FK
    ObjectId invitedBy FK
    string token UK
    date expiresAt
    date acceptedAt
  }
  BOARD {
    ObjectId _id PK
    string name
    ObjectId workspaceId FK
    ObjectId createdBy FK
  }
  BOARD_MEMBER {
    ObjectId _id PK
    ObjectId userId FK
    ObjectId boardId FK
    string role
  }
  COLUMN {
    ObjectId _id PK
    string name
    ObjectId boardId FK
    int order
  }
  TASK {
    ObjectId _id PK
    string title
    string description
    ObjectId boardId FK
    ObjectId columnId FK
    ObjectId createdBy FK
    ObjectId assignedTo FK
    string priority
    int order
  }
  ATTACHMENT {
    ObjectId _id PK
    ObjectId taskId FK
    ObjectId uploadedBy FK
    string originalName
    string fileName
    string mimeType
    number size
    string path
  }
  AUDIT_LOG {
    ObjectId _id PK
    string action
    ObjectId userId FK
    ObjectId workspaceId FK
    string entityType
    ObjectId entityId
    object details
  }
```

## Getting started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Redis
- Docker & Docker Compose (optional, for containerized setup)

### Local setup

```bash
# clone the repo
git clone <your-repo-url>
cd <your-repo-folder>

# install dependencies
npm install

# copy env file and fill in values
cp .env.example .env

# run the dev server
npm run dev
```

### Docker setup

Everything — frontend, backend API, background worker, Redis, and MongoDB —
runs as containers via Docker Compose. No local Node/Mongo/Redis install needed.

```bash
docker-compose up --build
```

This spins up:
- `frontend` — React app served via Nginx
- `api` — Express REST API + Socket.io server
- `worker` — BullMQ background job processor
- `redis` — cache and job queue
- `mongo` — primary database

## Environment variables

<!-- List your actual required env vars here -->
```
MONGO_URI=
REDIS_URL=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
PORT=
```

## API documentation

Swagger UI is available at `/api-docs` once the server is running.

## Testing

```bash
npm run test
```

## Project structure

<!-- Adjust to match your actual folder layout -->
```
src/
  models/       # Mongoose schemas
  routes/       # Express routes
  controllers/  # Route handlers
  middleware/   # Auth, RBAC, error handling
  services/     # Business logic, BullMQ jobs
  sockets/      # Socket.io handlers
```