export const dashboardPaths = {
  "/api/dashboard": {
    get: {
      tags: ["Dashboard"],
      summary: "Get dashboard metrics and assigned tasks",
      description:
        "Fetches dashboard overview stats, active projects with member counts, user's assigned tasks, and workspace-wide recent tasks. Cached in Redis for 5 minutes.",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "Dashboard metrics fetched successfully (Note: returns status 201 or 200)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DashboardResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Forbidden - user is not a member of this workspace",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/dashboard/recent-activity": {
    get: {
      tags: ["Dashboard"],
      summary: "Get recent workspace activity logs",
      description: "Retrieves the last 5 audit activities across the workspace with user initials, color badges, and human-readable messages.",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "Recent activities fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RecentActivitiesResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Forbidden - user is not a member of this workspace",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/dashboard/profile": {
    get: {
      tags: ["Dashboard"],
      summary: "Get logged-in user profile with statistics",
      description: "Returns the authenticated user's name, email, and counts of created projects and tasks.",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "Profile fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ProfileResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};
