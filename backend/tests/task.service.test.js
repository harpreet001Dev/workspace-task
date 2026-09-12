import { jest } from "@jest/globals";

const Task = {
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const Board = {
  findById: jest.fn(),
};

const Column = {
  findOne: jest.fn(),
  findById: jest.fn(),
};

const Attachment = {
  insertMany: jest.fn(),
  find: jest.fn(),
  deleteMany: jest.fn(),
};

const WorkspaceMember = {
  find: jest.fn(),
};

const redisConnection = {
  del: jest.fn(),
};

jest.unstable_mockModule("../src/models/Task.js", () => ({
  default: Task,
}));

jest.unstable_mockModule("../src/models/Board.js", () => ({
  default: Board,
}));

jest.unstable_mockModule("../src/models/Column.js", () => ({
  default: Column,
}));

jest.unstable_mockModule("../src/models/Attachment.js", () => ({
  default: Attachment,
}));

jest.unstable_mockModule("../src/models/WorkspaceMember.js", () => ({
  default: WorkspaceMember,
}));

jest.unstable_mockModule("../src/config/redis.js", () => ({
  default: redisConnection,
}));

const { default: taskService } = await import(
  "../src/service/task.service.js"
);

describe("Task Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task without attachments", async () => {
      const board = {
        _id: "board-1",
        workspaceId: "workspace-1",
      };

      const task = {
        _id: "task-1",
        title: "Test task",
        toObject: jest.fn().mockReturnValue({
          _id: "task-1",
          title: "Test task",
        }),
      };

      Board.findById.mockResolvedValue(board);

      Column.findOne.mockResolvedValue({
        _id: "column-1",
        boardId: "board-1",
      });

      Task.create.mockResolvedValue(task);

      WorkspaceMember.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([
          { userId: "user-1" },
          { userId: "user-2" },
        ]),
      });

      const result = await taskService.createTask(
        "board-1",
        "user-1",
        {
          title: "Test task",
          description: "Description",
          columnId: "column-1",
          priority: "high",
          order: 1,
          assignedTo: "user-2",
        }
      );

      expect(Board.findById).toHaveBeenCalledWith("board-1");

      expect(Column.findOne).toHaveBeenCalledWith({
        _id: "column-1",
        boardId: "board-1",
      });

      expect(Task.create).toHaveBeenCalledWith({
        title: "Test task",
        description: "Description",
        boardId: "board-1",
        columnId: "column-1",
        createdBy: "user-1",
        priority: "high",
        order: 1,
        assignedTo: "user-2",
      });

      expect(redisConnection.del).toHaveBeenCalledTimes(2);

      expect(result).toEqual({
        _id: "task-1",
        title: "Test task",
        workspaceId: "workspace-1",
        attachments: [],
      });
    });

    it("should reject when board does not exist", async () => {
      Board.findById.mockResolvedValue(null);

      await expect(
        taskService.createTask("board-1", "user-1", {
          title: "Test task",
          columnId: "column-1",
        })
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Board not found",
      });

      expect(Task.create).not.toHaveBeenCalled();
    });

    it("should reject when column does not belong to board", async () => {
      Board.findById.mockResolvedValue({
        _id: "board-1",
        workspaceId: "workspace-1",
      });

      Column.findOne.mockResolvedValue(null);

      await expect(
        taskService.createTask("board-1", "user-1", {
          title: "Test task",
          columnId: "column-1",
        })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Column does not belong to this board",
      });

      expect(Task.create).not.toHaveBeenCalled();
    });

    it("should create task attachments", async () => {
      const board = {
        _id: "board-1",
        workspaceId: "workspace-1",
      };

      const task = {
        _id: "task-1",
        toObject: jest.fn().mockReturnValue({
          _id: "task-1",
          title: "Task",
        }),
      };

      const files = [
        {
          originalname: "test.pdf",
          filename: "abc.pdf",
          mimetype: "application/pdf",
          size: 1000,
        },
      ];

      Board.findById.mockResolvedValue(board);
      Column.findOne.mockResolvedValue({});
      Task.create.mockResolvedValue(task);

      Attachment.insertMany.mockResolvedValue([
        {
          _id: "attachment-1",
          taskId: "task-1",
          originalName: "test.pdf",
        },
      ]);

      WorkspaceMember.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([]),
      });

      const result = await taskService.createTask(
        "board-1",
        "user-1",
        {
          title: "Task",
          columnId: "column-1",
        },
        files
      );

      expect(Attachment.insertMany).toHaveBeenCalledWith([
        {
          taskId: "task-1",
          uploadedBy: "user-1",
          originalName: "test.pdf",
          fileName: "abc.pdf",
          mimeType: "application/pdf",
          size: 1000,
          path: "/uploads/abc.pdf",
        },
      ]);

      expect(result.attachments).toHaveLength(1);
    });
  });

  describe("uploadTaskAttachments", () => {
    it("should upload attachments to an existing task", async () => {
      const task = {
        _id: "task-1",
      };

      const files = [
        {
          originalname: "image.png",
          filename: "image-1.png",
          mimetype: "image/png",
          size: 500,
        },
      ];

      Task.findById.mockResolvedValue(task);

      Attachment.insertMany.mockResolvedValue([
        {
          _id: "attachment-1",
        },
      ]);

      const result = await taskService.uploadTaskAttachments(
        "task-1",
        "user-1",
        files
      );

      expect(Task.findById).toHaveBeenCalledWith("task-1");

      expect(Attachment.insertMany).toHaveBeenCalled();

      expect(result).toEqual([
        {
          _id: "attachment-1",
        },
      ]);
    });

    it("should reject when task does not exist", async () => {
      Task.findById.mockResolvedValue(null);

      await expect(
        taskService.uploadTaskAttachments(
          "task-1",
          "user-1",
          []
        )
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Task not found",
      });
    });
  });

  describe("getTaskAttachments", () => {
    it("should return task attachments", async () => {
      Task.findById.mockResolvedValue({
        _id: "task-1",
      });

      const attachments = [
        {
          _id: "attachment-1",
          taskId: "task-1",
        },
      ];

      Attachment.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(attachments),
        }),
      });

      const result = await taskService.getTaskAttachments("task-1");

      expect(Attachment.find).toHaveBeenCalledWith({
        taskId: "task-1",
      });

      expect(result).toEqual(attachments);
    });

    it("should reject when task does not exist", async () => {
      Task.findById.mockResolvedValue(null);

      await expect(
        taskService.getTaskAttachments("task-1")
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Task not found",
      });
    });
  });

  describe("getAllTasks", () => {
    it("should return tasks with their attachments", async () => {
      Board.findById.mockResolvedValue({
        _id: "board-1",
      });

      const tasks = [
        {
          _id: "task-1",
          title: "Task 1",
          assignedTo: {
            name: "John",
          },
          columnId: {
            name: "Todo",
          },
        },
      ];

      Task.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(tasks),
            }),
          }),
        }),
      });

      const attachments = [
        {
          _id: "attachment-1",
          taskId: {
            toString: () => "task-1",
          },
        },
      ];

      Attachment.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(attachments),
        }),
      });

      const result = await taskService.getAllTasks("board-1");

      expect(Task.find).toHaveBeenCalledWith({
        boardId: "board-1",
      });

      expect(result).toEqual([
        {
          ...tasks[0],
          attachments,
        },
      ]);
    });

    it("should reject when board does not exist", async () => {
      Board.findById.mockResolvedValue(null);

      await expect(
        taskService.getAllTasks("board-1")
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Board not found",
      });
    });
  });

  describe("updateTask", () => {
    it("should update task fields", async () => {
      Task.findById.mockResolvedValue({
        _id: "task-1",
        boardId: "board-1",
      });

      Board.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          _id: "board-1",
          workspaceId: "workspace-1",
        }),
      });

      const updatedTask = {
        _id: "task-1",
        title: "Updated title",
        description: "Updated description",
        priority: "low",
      };

      Task.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(updatedTask),
          }),
        }),
      });

      const result = await taskService.updateTask(
        "task-1",
        "user-1",
        "workspace-1",
        {
          title: "  Updated title  ",
          description: "  Updated description  ",
          priority: "low",
          assignedTo: "",
        }
      );

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        "task-1",
        {
          $set: {
            title: "Updated title",
            description: "Updated description",
            priority: "low",
            assignedTo: null,
          },
        },
        { new: true }
      );

      expect(result).toEqual({
        ...updatedTask,
        workspaceId: "workspace-1",
      });
    });

    it("should reject when task does not exist", async () => {
      Task.findById.mockResolvedValue(null);

      await expect(
        taskService.updateTask(
          "task-1",
          "user-1",
          "workspace-1",
          { title: "Updated" }
        )
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Task not found",
      });
    });

    it("should reject when board does not exist", async () => {
      Task.findById.mockResolvedValue({
        boardId: "board-1",
      });

      Board.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        taskService.updateTask(
          "task-1",
          "user-1",
          "workspace-1",
          { title: "Updated" }
        )
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Board not found",
      });
    });

    it("should reject when workspace does not match", async () => {
      Task.findById.mockResolvedValue({
        boardId: "board-1",
      });

      Board.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          workspaceId: {
            toString: () => "different-workspace",
          },
        }),
      });

      await expect(
        taskService.updateTask(
          "task-1",
          "user-1",
          "workspace-1",
          { title: "Updated" }
        )
      ).rejects.toMatchObject({
        statusCode: 403,
        message: "Task does not belong to your workspace",
      });
    });

    it("should reject when no fields are provided", async () => {
      Task.findById.mockResolvedValue({
        boardId: "board-1",
      });

      Board.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          workspaceId: {
            toString: () => "workspace-1",
          },
        }),
      });

      await expect(
        taskService.updateTask(
          "task-1",
          "user-1",
          "workspace-1",
          {}
        )
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "No task fields provided for update",
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete task and attachments", async () => {
      const task = {
        _id: "task-1",
        boardId: "board-1",
        createdBy: {
          toString: () => "user-1",
        },
      };

      const board = {
        _id: "board-1",
        workspaceId: {
          toString: () => "workspace-1",
        },
        createdBy: {
          toString: () => "other-user",
        },
      };

      Task.findById.mockResolvedValue(task);

      Board.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(board),
      });

      Attachment.deleteMany.mockResolvedValue({});
      Task.findByIdAndDelete.mockResolvedValue(task);

      const result = await taskService.deleteTask("task-1", {
        _id: "user-1",
        workspaceId: "workspace-1",
        role: "member",
      });

      expect(Attachment.deleteMany).toHaveBeenCalledWith({
        taskId: "task-1",
      });

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith("task-1");

      expect(result).toEqual({
        task,
        board,
      });
    });

    it("should reject when task does not exist", async () => {
      Task.findById.mockResolvedValue(null);

      await expect(
        taskService.deleteTask("task-1", {
          _id: "user-1",
          workspaceId: "workspace-1",
          role: "member",
        })
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Task not found",
      });
    });

    it("should reject when user has no workspace", async () => {
      Task.findById.mockResolvedValue({
        boardId: "board-1",
      });

      Board.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          workspaceId: {
            toString: () => "workspace-1",
          },
        }),
      });

      await expect(
        taskService.deleteTask("task-1", {
          _id: "user-1",
          role: "member",
        })
      ).rejects.toMatchObject({
        statusCode: 403,
        message: "You are not a member of this workspace",
      });
    });

    it("should reject unauthorized task deletion", async () => {
      Task.findById.mockResolvedValue({
        boardId: "board-1",
        createdBy: {
          toString: () => "task-owner",
        },
      });

      Board.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          workspaceId: {
            toString: () => "workspace-1",
          },
          createdBy: {
            toString: () => "board-owner",
          },
        }),
      });

      await expect(
        taskService.deleteTask("task-1", {
          _id: "other-user",
          workspaceId: "workspace-1",
          role: "member",
        })
      ).rejects.toMatchObject({
        statusCode: 403,
      });

      expect(Task.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });

  describe("moveTask", () => {
    it("should move task within the same column", async () => {
      const task = {
        _id: "task-2",
        boardId: "board-1",
        columnId: "column-1",
        order: 2,
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue({
          _id: "task-2",
          boardId: "board-1",
          columnId: "column-1",
          order: 1,
        }),
      };

      const sourceColumn = {
        _id: "column-1",
      };

      const targetColumn = {
        _id: "column-1",
      };

      Board.findById.mockResolvedValue({
        workspaceId: "workspace-1",
      });

      Task.findById.mockResolvedValue(task);

      Column.findOne.mockResolvedValue(targetColumn);
      Column.findById.mockResolvedValue(sourceColumn);

      Task.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            {
              _id: "task-1",
              order: 1,
            },
            {
              _id: "task-2",
              order: 2,
            },
          ]),
        }),
      });

      Task.findByIdAndUpdate.mockResolvedValue({});

      const result = await taskService.moveTask(
        "task-2",
        "column-1",
        1
      );

      expect(Task.findByIdAndUpdate).toHaveBeenCalled();

      expect(task.save).toHaveBeenCalled();

      expect(result.sourceColumn).toEqual(sourceColumn);
      expect(result.targetColumn).toEqual(targetColumn);
    });

    it("should reject when task does not exist", async () => {
      Task.findById.mockResolvedValue(null);

      await expect(
        taskService.moveTask("task-1", "column-1", 1)
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Task not found",
      });
    });

    it("should reject when target column is invalid", async () => {
      Task.findById.mockResolvedValue({
        boardId: "board-1",
      });

      Column.findOne.mockResolvedValue(null);

      await expect(
        taskService.moveTask("task-1", "column-2", 1)
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Column does not belong to this board",
      });
    });

    it("should reject when source column does not exist", async () => {
      Task.findById.mockResolvedValue({
        boardId: "board-1",
        columnId: "column-1",
      });

      Column.findOne.mockResolvedValue({
        _id: "column-2",
      });

      Column.findById.mockResolvedValue(null);

      await expect(
        taskService.moveTask("task-1", "column-2", 1)
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Source column not found",
      });
    });
  });
});