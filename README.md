Mini SaaS Project Management Tool

A Trello + Notion + Slack inspired collaboration app, built as a Senior Full Stack Developer assignment. Supports workspaces, boards, columns, tasks, attachments, real-time updates, and role-based access control.

Tech stack
Backend: Node.js, Express, MongoDB (Mongoose), Redis, BullMQ, Socket.io
Auth: JWT (access + refresh tokens), RBAC
Frontend: React + Vite, Redux Toolkit / Zustand, React Hook Form
DevOps: Docker, Docker Compose, GitHub Actions, Swagger/OpenAPI

Features
JWT authentication with refresh token rotation
Role-based access control at workspace and board level
Workspaces → Boards → Columns → Tasks hierarchy
Task attachments, priorities, and audit logging
Real-time updates via Socket.io
Background jobs via BullMQ, caching via Redis
Swagger-documented REST API

Architecture diagram

All services run as separate Docker containers via Docker Compose.

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

ER diagram
