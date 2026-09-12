export const boardSchemas = {
  CreateBoardRequest: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Sprint Planning",
        description: "Name of the board",
      },
    },
  },

  UpdateBoardRequest: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Sprint Q3 Backlog",
      },
    },
  },

  CreateColumnRequest: {
    type: "object",
    required: ["name", "order"],
    properties: {
      name: {
        type: "string",
        enum: ["To Do", "In Progress", "Done"],
        example: "In Progress",
      },
      order: {
        type: "integer",
        minimum: 1,
        example: 2,
      },
    },
  },

  AddBoardMemberRequest: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: {
        type: "string",
        example: "6701a2b3c4d5e6f7a8b9c0d1",
        description: "User ID of the member to add (must belong to workspace)",
      },
    },
  },

  ColumnItem: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f0" },
      name: { type: "string", example: "To do" },
      order: { type: "integer", example: 1 },
    },
  },

  BoardMemberItem: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
      name: { type: "string", example: "John Doe" },
      email: { type: "string", example: "john@example.com" },
      role: { type: "string", enum: ["owner", "member"], example: "member" },
    },
  },

  BoardSummary: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f1" },
      name: { type: "string", example: "Sprint Planning" },
      createdAt: { type: "string", format: "date-time" },
      createdBy: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
      columns: {
        type: "array",
        items: { $ref: "#/components/schemas/ColumnItem" },
      },
      members: {
        type: "array",
        items: { $ref: "#/components/schemas/BoardMemberItem" },
      },
      totalMembers: { type: "integer", example: 3 },
      totalColumns: { type: "integer", example: 4 },
    },
  },

  BoardListResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Boards fetched successfully" },
      data: {
        type: "object",
        properties: {
          boards: {
            type: "array",
            items: { $ref: "#/components/schemas/BoardSummary" },
          },
          nextCursor: {
            type: "string",
            nullable: true,
            example: "eyJjcmVhdGVkQXQiOiIyMDI2LTA5LTEy...",
            description: "Base64 cursor for cursor-based pagination",
          },
          hasMore: { type: "boolean", example: false },
        },
      },
    },
  },

  BoardDetailsResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Board data fetched successfully" },
      data: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f1" },
          name: { type: "string", example: "Sprint Planning" },
          workspaceId: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d2" },
          createdBy: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          columns: {
            type: "array",
            items: { $ref: "#/components/schemas/ColumnItem" },
          },
          members: {
            type: "array",
            items: { $ref: "#/components/schemas/BoardMemberItem" },
          },
          totalMembers: { type: "integer", example: 3 },
          totalColumns: { type: "integer", example: 4 },
        },
      },
    },
  },

  CreateBoardResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Board created successfully" },
      data: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f1" },
          name: { type: "string", example: "Sprint Planning" },
          workspaceId: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d2" },
          createdBy: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },

  CreateColumnResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Column created successfully" },
      data: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f0" },
          name: { type: "string", example: "In Progress" },
          boardId: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f1" },
          order: { type: "integer", example: 2 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },

  AddBoardMemberResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Board member added successfully" },
      data: {
        type: "object",
        properties: {
          _id: { type: "string", example: "6701c2d3e4f5a6b7c8d9e0f2" },
          boardId: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f1" },
          userId: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
          role: { type: "string", example: "member" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};
