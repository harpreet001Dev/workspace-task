export const boardPaths = {
  "/api/board/{workspaceId}": {
    post: {
      tags: ["Board"],
      summary: "Create a new board in workspace",
      description:
        "Creates a new board within the specified workspace. Automatically creates default columns ('To do', 'In progress', 'Review', 'Done'), registers the creator as a board member, invalidates the dashboard cache, and queues an audit log.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "workspaceId",
          in: "path",
          required: true,
          description: "Target workspace ObjectId",
          schema: {
            type: "string",
            example: "6701a2b3c4d5e6f7a8b9c0d2",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateBoardRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Board created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateBoardResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationErrorResponse",
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
          description: "Forbidden",
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

  "/api/board/search": {
    get: {
      tags: ["Board"],
      summary: "Search boards by name",
      description: "Searches boards in the current workspace by name (case-insensitive substring match).",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          description: "Search keyword (1-100 chars)",
          schema: {
            type: "string",
            example: "Sprint",
          },
        },
      ],
      responses: {
        200: {
          description: "Boards fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Boards fetched successfully" },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/BoardSummary" },
                  },
                },
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
          description: "Forbidden - user is not a member of workspace",
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

  "/api/board/{boardId}/members": {
    post: {
      tags: ["Board"],
      summary: "Add a member to a board",
      description: "Adds a user to a board. Only the board creator can add members, and the user must belong to the workspace.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "boardId",
          in: "path",
          required: true,
          description: "Target board ObjectId",
          schema: {
            type: "string",
            example: "6701c1d2e3f4a5b6c7d8e9f1",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AddBoardMemberRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Board member added successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AddBoardMemberResponse",
              },
            },
          },
        },
        400: {
          description: "User is not a member of this workspace or validation error",
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
          description: "Forbidden - only the board creator can add members",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Board not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "User is already a board member",
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

  "/api/board/{boardId}/columns": {
    post: {
      tags: ["Board"],
      summary: "Add a custom column to a board",
      description: "Creates an additional column inside a board with a specified order.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "boardId",
          in: "path",
          required: true,
          description: "Target board ObjectId",
          schema: {
            type: "string",
            example: "6701c1d2e3f4a5b6c7d8e9f1",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateColumnRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Column created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateColumnResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationErrorResponse",
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
          description: "Forbidden",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Board not found",
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

  "/api/board": {
    get: {
      tags: ["Board"],
      summary: "Get boards for workspace (cursor pagination)",
      description: "Returns paginated boards in the user's active workspace with columns and member details.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          description: "Number of boards to return (1-50, default 10)",
          schema: {
            type: "integer",
            default: 10,
            minimum: 1,
            maximum: 50,
          },
        },
        {
          name: "cursor",
          in: "query",
          required: false,
          description: "Base64 encoded cursor from previous response",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        201: {
          description: "Boards fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BoardListResponse",
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
          description: "Forbidden - not a member of this workspace",
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

  "/api/board/{boardId}": {
    get: {
      tags: ["Board"],
      summary: "Get board details by ID",
      description: "Retrieves complete details of a board including columns sorted by order and populated board members.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "boardId",
          in: "path",
          required: true,
          description: "Board ObjectId",
          schema: {
            type: "string",
            example: "6701c1d2e3f4a5b6c7d8e9f1",
          },
        },
      ],
      responses: {
        200: {
          description: "Board data fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BoardDetailsResponse",
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
          description: "Forbidden - user is not a member of this board",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Board not found",
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

    patch: {
      tags: ["Board"],
      summary: "Update board name",
      description: "Updates the name of a board. Requester must be a member of the board.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "boardId",
          in: "path",
          required: true,
          description: "Board ObjectId",
          schema: {
            type: "string",
            example: "6701c1d2e3f4a5b6c7d8e9f1",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateBoardRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Board updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateBoardResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error or board name missing",
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
          description: "Forbidden - user is not a member of this board",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Board not found",
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

    delete: {
      tags: ["Board"],
      summary: "Delete a board",
      description: "Deletes a board and cascades deletion to all its members, columns, and tasks. Requester must be workspace owner or board creator.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "boardId",
          in: "path",
          required: true,
          description: "Board ObjectId",
          schema: {
            type: "string",
            example: "6701c1d2e3f4a5b6c7d8e9f1",
          },
        },
      ],
      responses: {
        200: {
          description: "Board deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateBoardResponse",
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
          description: "Forbidden - only workspace owner or board creator can delete",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Board or workspace not found",
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
