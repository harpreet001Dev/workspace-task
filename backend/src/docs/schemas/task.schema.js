export const taskSchemas = {
  CreateTaskRequest: {
    type: "object",
    required: ["title", "columnId", "order", "assignedTo"],
    properties: {
      title: {
        type: "string",
        minLength: 2,
        maxLength: 200,
        example: "Implement OAuth login",
      },
      description: {
        type: "string",
        maxLength: 2000,
        example: "Support Google and GitHub OAuth providers",
      },
      columnId: {
        type: "string",
        example: "6701c1d2e3f4a5b6c7d8e9f0",
        description: "ObjectId of the column this task belongs to",
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        default: "medium",
        example: "high",
      },
      order: {
        type: "integer",
        minimum: 1,
        example: 1,
      },
      assignedTo: {
        type: "string",
        example: "6701a2b3c4d5e6f7a8b9c0d1",
        description: "Valid user ObjectId assigned to this task",
      },
      files: {
        type: "array",
        items: {
          type: "string",
          format: "binary",
        },
        description: "Optional task attachment files (up to 10 files)",
      },
    },
  },

  UpdateTaskRequest: {
    type: "object",
    properties: {
      title: {
        type: "string",
        minLength: 2,
        maxLength: 200,
        example: "Implement Google OAuth login",
      },
      description: {
        type: "string",
        maxLength: 2000,
        example: "Support Google OAuth provider with refresh tokens",
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        example: "medium",
      },
      assignedTo: {
        type: "string",
        nullable: true,
        example: "6701a2b3c4d5e6f7a8b9c0d1",
        description: "User ObjectId or null to unassign",
      },
    },
  },

  MoveTaskRequest: {
    type: "object",
    required: ["columnId", "order"],
    properties: {
      columnId: {
        type: "string",
        example: "6701c1d2e3f4a5b6c7d8e9f2",
        description: "Target column ObjectId",
      },
      order: {
        type: "integer",
        minimum: 1,
        example: 2,
        description: "New 1-based order index inside target column",
      },
    },
  },

  AttachmentItem: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6701d1e2f3a4b5c6d7e8f9a0" },
      taskId: { type: "string", example: "6701d2e3f4a5b6c7d8e9f0a1" },
      uploadedBy: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
      originalName: { type: "string", example: "spec-doc.pdf" },
      fileName: { type: "string", example: "1726140000000-spec-doc.pdf" },
      mimeType: { type: "string", example: "application/pdf" },
      size: { type: "integer", example: 1048576 },
      path: { type: "string", example: "/uploads/1726140000000-spec-doc.pdf" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  TaskItem: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6701d2e3f4a5b6c7d8e9f0a1" },
      title: { type: "string", example: "Implement OAuth login" },
      description: { type: "string", example: "Support Google and GitHub OAuth providers" },
      boardId: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f1" },
      columnId: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f0" },
          name: { type: "string", example: "To do" },
        },
      },
      assignedTo: {
        type: "object",
        nullable: true,
        properties: {
          _id: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
          name: { type: "string", example: "John Doe" },
        },
      },
      priority: { type: "string", enum: ["low", "medium", "high"], example: "high" },
      order: { type: "integer", example: 1 },
      createdBy: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
      attachments: {
        type: "array",
        items: { $ref: "#/components/schemas/AttachmentItem" },
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  CreateTaskResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Task created successfully" },
      data: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6701d2e3f4a5b6c7d8e9f0a1" },
          title: { type: "string", example: "Implement OAuth login" },
          description: { type: "string", example: "Support Google and GitHub OAuth providers" },
          boardId: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f1" },
          columnId: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f0" },
          priority: { type: "string", example: "high" },
          order: { type: "integer", example: 1 },
          createdBy: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
          assignedTo: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
          workspaceId: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d2" },
          attachments: {
            type: "array",
            items: { $ref: "#/components/schemas/AttachmentItem" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },

  TaskResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Task updated successfully" },
      data: { $ref: "#/components/schemas/TaskItem" },
    },
  },

  TaskListResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Tasks fetched successfully" },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/TaskItem" },
      },
    },
  },

  TaskAttachmentsResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Attachments fetched successfully" },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/AttachmentItem" },
      },
    },
  },
};
