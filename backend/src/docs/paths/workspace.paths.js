export const workspacePaths = {
  "/api/workspace/create": {
    post: {
      tags: ["Workspace"],
      summary: "Create a new workspace",
      description:
        "Creates a new workspace, assigns the creator as the owner, and generates a new access token scoped to this workspace.",
      security: [
        {
          BearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateWorkspaceRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Workspace created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkspaceResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error (invalid name/description length)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationErrorResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized - missing or invalid JWT bearer token",
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

  "/api/workspace/users": {
    get: {
      tags: ["Workspace"],
      summary: "Get members of the current workspace",
      description: "Returns a list of all members and their roles in the current active workspace.",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Workspace users fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/WorkspaceUsersResponse",
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

  "/api/workspace/invite": {
    post: {
      tags: ["Workspace"],
      summary: "Create workspace invitation",
      description: "Generates a unique invitation link with a 24-hour expiration. Only workspace owners can create invites.",
      security: [
        {
          BearerAuth: [],
        },
      ],
      responses: {
        201: {
          description: "Invitation created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/WorkspaceInviteResponse",
              },
            },
          },
        },
        400: {
          description: "Workspace not found for current user",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
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
          description: "Forbidden - only workspace owners can create invites",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Workspace not found",
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

  "/api/workspace/invite/{token}/accept": {
    post: {
      tags: ["Workspace"],
      summary: "Accept workspace invitation",
      description: "Accepts an invitation using the unique invite token, joins the user as a member, and returns an updated access token.",
      security: [
        {
          BearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "token",
          in: "path",
          required: true,
          description: "Invitation hex token",
          schema: {
            type: "string",
            example: "a4f8e6c710d24e93817f54c9...",
          },
        },
      ],
      responses: {
        200: {
          description: "Invitation accepted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AcceptInviteResponse",
              },
            },
          },
        },
        400: {
          description: "Invitation has expired, already used, or user is already a member",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
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
        404: {
          description: "Invalid invitation token",
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
