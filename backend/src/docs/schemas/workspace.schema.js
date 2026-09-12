export const workspaceSchemas = {
  CreateWorkspaceRequest: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Engineering Squad",
        description: "Name of the workspace",
      },
      description: {
        type: "string",
        maxLength: 500,
        example: "Workspace for core platform engineering",
        description: "Optional description of the workspace",
      },
    },
  },

  CreateWorkspaceResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Workspace added successfully",
      },
      data: {
        type: "object",
        properties: {
          workspace: {
            type: "object",
            properties: {
              _id: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d2" },
              name: { type: "string", example: "Engineering Squad" },
              description: { type: "string", example: "Workspace for core platform engineering" },
              role: { type: "string", example: "owner" },
            },
          },
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            description: "Updated access token including the workspace ID and owner role",
          },
        },
      },
    },
  },

  WorkspaceUserItem: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
      name: { type: "string", example: "John Doe" },
      email: { type: "string", example: "john@example.com" },
      role: { type: "string", enum: ["owner", "member"], example: "owner" },
    },
  },

  WorkspaceUsersResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Workspace users fetched successfully",
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/WorkspaceUserItem",
        },
      },
    },
  },

  WorkspaceInviteResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Invitation created successfully",
      },
      data: {
        type: "object",
        properties: {
          inviteId: { type: "string", example: "6701b1c2d3e4f5a6b7c8d9e0" },
          token: { type: "string", example: "a4f8e6c710d24e93817f54c9..." },
          inviteLink: { type: "string", example: "http://localhost:5173/invite/a4f8e6c710d24e93817f54c9..." },
          expiresAt: { type: "string", format: "date-time", example: "2026-09-13T10:00:00.000Z" },
        },
      },
    },
  },

  AcceptInviteResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Invitation accepted successfully",
      },
      data: {
        type: "object",
        properties: {
          workspaceId: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d2" },
          workspace: {
            type: "object",
            properties: {
              _id: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d2" },
              name: { type: "string", example: "Engineering Squad" },
              role: { type: "string", example: "member" },
            },
          },
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            description: "Updated access token including new workspace ID and member role",
          },
          member: {
            type: "object",
            properties: {
              _id: { type: "string", example: "6701b2c3d4e5f6a7b8c9d0e1" },
              userId: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
              workspaceId: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d2" },
              role: { type: "string", example: "member" },
            },
          },
        },
      },
    },
  },
};
