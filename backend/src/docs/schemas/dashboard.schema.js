export const dashboardSchemas = {
  DashboardStats: {
    type: "object",
    properties: {
      totalProjects: { type: "integer", example: 4 },
      myTasks: { type: "integer", example: 12 },
      members: { type: "integer", example: 5 },
    },
  },

  ProjectWithMembers: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6701c1d2e3f4a5b6c7d8e9f1" },
      name: { type: "string", example: "Sprint Planning" },
      createdAt: { type: "string", format: "date-time" },
      totalMembers: { type: "integer", example: 3 },
    },
  },

  DashboardResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Task created successfully" },
      data: {
        type: "object",
        properties: {
          stats: { $ref: "#/components/schemas/DashboardStats" },
          projectsWithMembers: {
            type: "array",
            items: { $ref: "#/components/schemas/ProjectWithMembers" },
          },
          myTasks: {
            type: "array",
            items: { $ref: "#/components/schemas/TaskItem" },
          },
          allTasks: {
            type: "array",
            items: { $ref: "#/components/schemas/TaskItem" },
          },
        },
      },
    },
  },

  RecentActivityItem: {
    type: "object",
    properties: {
      _id: { type: "string", example: "6701e1f2a3b4c5d6e7f8a9b0" },
      action: {
        type: "string",
        enum: [
          "BOARD_CREATED",
          "BOARD_UPDATED",
          "BOARD_DELETED",
          "TASK_CREATED",
          "TASK_UPDATED",
          "TASK_DELETED",
          "TASK_MOVED",
        ],
        example: "TASK_MOVED",
      },
      message: {
        type: "string",
        example: "John Doe moved task \"Implement OAuth login\" from \"To do\" to \"In progress\"",
      },
      timeLabel: { type: "string", example: "5 minutes ago" },
      initials: { type: "string", example: "JD" },
      colorClass: { type: "string", example: "bg-violet-500" },
      createdAt: { type: "string", format: "date-time" },
      details: { type: "object" },
    },
  },

  RecentActivitiesResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Recent activities fetched successfully" },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/RecentActivityItem" },
      },
    },
  },

  ProfileResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Profile fetched successfully" },
      data: {
        type: "object",
        properties: {
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          totalProjects: { type: "integer", example: 4 },
          totalTasks: { type: "integer", example: 12 },
        },
      },
    },
  },
};
