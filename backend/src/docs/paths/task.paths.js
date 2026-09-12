export const taskPaths = {
  "/api/task/{boardId}": {
    post: {
      tags: ["Task"],
      summary: "Create a new task with optional file attachments",
      description:
        "Creates a task in a specific board column with optional file uploads (up to 10 files). Triggers audit logging and invalidates dashboard caches for workspace members.",
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
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/CreateTaskRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Task created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTaskResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error or column does not belong to this board",
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

  "/api/task/{taskId}/attachments": {
    get: {
      tags: ["Task"],
      summary: "Get task attachments",
      description: "Retrieves metadata of all files attached to a specific task.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "taskId",
          in: "path",
          required: true,
          description: "Task ObjectId",
          schema: {
            type: "string",
            example: "6701d2e3f4a5b6c7d8e9f0a1",
          },
        },
      ],
      responses: {
        200: {
          description: "Attachments fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskAttachmentsResponse",
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
          description: "Task not found",
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

    post: {
      tags: ["Task"],
      summary: "Upload attachments to an existing task",
      description: "Uploads up to 10 additional files to an existing task.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "taskId",
          in: "path",
          required: true,
          description: "Task ObjectId",
          schema: {
            type: "string",
            example: "6701d2e3f4a5b6c7d8e9f0a1",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["files"],
              properties: {
                files: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "binary",
                  },
                  description: "Files to upload (max 10)",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Attachments uploaded successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskAttachmentsResponse",
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
          description: "Task not found",
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

  "/api/task/{boardId}/get": {
    get: {
      tags: ["Task"],
      summary: "Get all tasks for a board",
      description: "Returns all tasks belonging to a board with populated assigned user, column, and attachments, sorted by order and creation date.",
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
          description: "Tasks fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskListResponse",
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

  "/api/task/{taskId}": {
    patch: {
      tags: ["Task"],
      summary: "Update task details",
      description: "Updates title, description, priority, or assigned user of a task within the workspace.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "taskId",
          in: "path",
          required: true,
          description: "Task ObjectId",
          schema: {
            type: "string",
            example: "6701d2e3f4a5b6c7d8e9f0a1",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateTaskRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Task updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error or no update fields provided",
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
          description: "Forbidden - task does not belong to your workspace",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Task not found",
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
      tags: ["Task"],
      summary: "Delete a task",
      description: "Deletes a task and its attachments. Can be performed by workspace owner, board creator, or task creator.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "taskId",
          in: "path",
          required: true,
          description: "Task ObjectId",
          schema: {
            type: "string",
            example: "6701d2e3f4a5b6c7d8e9f0a1",
          },
        },
      ],
      responses: {
        200: {
          description: "Task deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SuccessMessageResponse",
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
          description: "Forbidden - only workspace owner, project owner, or task creator can delete",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Task not found",
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

  "/api/task/{taskId}/move": {
    patch: {
      tags: ["Task"],
      summary: "Move task to another column or reorder",
      description:
        "Moves a task into a target column and sets its order position, readjusting sibling orders in both source and target columns. Broadcasts real-time 'task:moved' event via Socket.IO and logs to Audit.",
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "taskId",
          in: "path",
          required: true,
          description: "Task ObjectId",
          schema: {
            type: "string",
            example: "6701d2e3f4a5b6c7d8e9f0a1",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/MoveTaskRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Task moved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskResponse",
              },
            },
          },
        },
        400: {
          description: "Column does not belong to this board or validation error",
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
          description: "Task or Column not found",
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
