import { commonSchemas } from "./schemas/common.schema.js";
import { authSchemas } from "./schemas/auth.schema.js";
import { workspaceSchemas } from "./schemas/workspace.schema.js";
import { boardSchemas } from "./schemas/board.schema.js";
import { taskSchemas } from "./schemas/task.schema.js";
import { dashboardSchemas } from "./schemas/dashboard.schema.js";

import { authPaths } from "./paths/auth.paths.js";
import { workspacePaths } from "./paths/workspace.paths.js";
import { boardPaths } from "./paths/board.paths.js";
import { taskPaths } from "./paths/task.paths.js";
import { dashboardPaths } from "./paths/dashboard.paths.js";

export const openapiSpecification = {
  openapi: "3.0.3",
  info: {
    title: "Workspace & Project Management API",
    version: "1.0.0",
    description: `
### Overview
Welcome to the **Workspace & Project Management REST API** documentation.
This API powers a collaborative project management workspace with real-time updates via Socket.IO, background audit logging via BullMQ, and Redis caching.

### Authentication
Most endpoints require a JWT Bearer Token in the \`Authorization\` header:
\`\`\`http
Authorization: Bearer <your_access_token>
\`\`\`
1. Use **POST /api/auth/register** or **POST /api/auth/login** to obtain an \`accessToken\`.
2. Click the **Authorize** button at the top right of this page and enter your token as \`Bearer <your_token>\` or simply \`<your_token>\`.
3. The server also uses an \`httpOnly\` cookie (\`refreshToken\`) for rotating session credentials.
    `,
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "User authentication, registration, token refresh, and logout",
    },
    {
      name: "Workspace",
      description: "Workspace creation, member management, and invite links",
    },
    {
      name: "Board",
      description: "Kanban board management, column customization, and member assignments",
    },
    {
      name: "Task",
      description: "Task CRUD operations, drag-and-drop column movements, and file attachments",
    },
    {
      name: "Dashboard",
      description: "Workspace analytics, metrics, user statistics, and recent activity feed",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Service health check",
        description: "Returns 200 OK if the backend server is running and healthy.",
        responses: {
          200: {
            description: "Backend is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    message: { type: "string", example: "Backend is healthy" },
                  },
                },
              },
            },
          },
        },
      },
    },
    ...authPaths,
    ...workspacePaths,
    ...boardPaths,
    ...taskPaths,
    ...dashboardPaths,
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT Bearer token in the format: Bearer <token>",
      },
      CookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description: "httpOnly refresh token cookie",
      },
    },
    schemas: {
      ...commonSchemas,
      ...authSchemas,
      ...workspaceSchemas,
      ...boardSchemas,
      ...taskSchemas,
      ...dashboardSchemas,
    },
  },
};

export default openapiSpecification;
