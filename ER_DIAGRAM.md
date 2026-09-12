# ER Diagram — Mini SaaS (Notion + Trello + Slack)

Generated from the actual Mongoose models: `User`, `RefreshToken`, `Workspace`,
`WorkspaceMember`, `WorkspaceInvite`, `Board`, `BoardMember`, `Column`, `Task`,
`Attachment`, `AuditLog`.

> This block renders automatically as a diagram on GitHub (README/markdown viewers
> that support Mermaid). If viewing elsewhere, see `ER_Diagram.png` in this folder.

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

## Relationship notes

- **User → Workspace / Board** (`ownerId` / `createdBy`): one user can own many
  workspaces and create many boards.
- **WorkspaceMember / BoardMember**: join collections carrying `role`
  (`owner`/`member`) — implements RBAC at both the workspace and board level.
- **Board.members[]** also embeds an array of `User` refs directly on the board
  document. This overlaps with `BoardMember` and should be reconciled — either
  drop the embedded array in favor of `BoardMember`, or document why both exist.
- **Column.name** is a fixed enum (`To do`, `In progress`, `Review`, `Done`),
  so columns are stage-based rather than freely renamable lists.
- **Task**: belongs to one `Board` and one `Column`; has a creator
  (`createdBy`) and an optional assignee (`assignedTo`), both referencing `User`.
- **Attachment**: always tied to one `Task` and the `User` who uploaded it.
- **AuditLog**: references `User` and `Workspace` directly, but `entityId` is a
  polymorphic reference (resolved via the `entityType` enum: `BOARD` or `TASK`)
  rather than a formal Mongoose `ref` — not drawable as a single FK line.