import { jest } from "@jest/globals";

const createTask = jest.fn();
const uploadTaskAttachments = jest.fn();
const getTaskAttachments = jest.fn();
const getAllTasks = jest.fn();
const updateTask = jest.fn();
const deleteTask = jest.fn();
const moveTask = jest.fn();
const addAuditLog = jest.fn();

jest.unstable_mockModule("../src/service/task.service.js", () => ({
  default: {
    createTask,
    uploadTaskAttachments,
    getTaskAttachments,
    getAllTasks,
    updateTask,
    deleteTask,
    moveTask,
  },
}));

jest.unstable_mockModule("../src/service/auditLog.service.js", () => ({
  default: addAuditLog,
}));

const {
  createTask: createTaskController,
  uploadTaskAttachments: uploadTaskAttachmentsController,
  getTaskAttachments: getTaskAttachmentsController,
  getAllTasks: getAllTasksController,
  updateTask: updateTaskController,
  deleteTask: deleteTaskController,
  moveTask: moveTaskController,
} = await import("../src/controllers/task.controller.js");

describe("Task Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  it("should create task", async () => {
    const req = {
      params: { boardId: "board123" },
      user: { _id: "user123" },
      body: { title: "Test Task" },
      files: [],
    };

    const res = createResponse();

    const task = {
      _id: "task123",
      title: "Test Task",
      boardId: "board123",
      workspaceId: "workspace123",
      columnId: "column123",
      priority: "high",
      assignedTo: null,
    };

    createTask.mockResolvedValue(task);

    await createTaskController(req, res);

    expect(createTask).toHaveBeenCalledWith(
      "board123",
      "user123",
      req.body,
      []
    );

    expect(addAuditLog).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should upload task attachments", async () => {
    const req = {
      params: { taskId: "task123" },
      user: { _id: "user123" },
      files: [],
    };

    const res = createResponse();

    uploadTaskAttachments.mockResolvedValue([
      { filename: "file.jpg" },
    ]);

    await uploadTaskAttachmentsController(req, res);

    expect(uploadTaskAttachments).toHaveBeenCalledWith(
      "task123",
      "user123",
      []
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get task attachments", async () => {
    const req = {
      params: { taskId: "task123" },
    };

    const res = createResponse();

    getTaskAttachments.mockResolvedValue([
      { filename: "file.jpg" },
    ]);

    await getTaskAttachmentsController(req, res);

    expect(getTaskAttachments).toHaveBeenCalledWith("task123");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should get all tasks", async () => {
    const req = {
      params: { boardId: "board123" },
    };

    const res = createResponse();

    getAllTasks.mockResolvedValue([
      { _id: "task123", title: "Test Task" },
    ]);

    await getAllTasksController(req, res);

    expect(getAllTasks).toHaveBeenCalledWith("board123");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should update task", async () => {
    const req = {
      params: { taskId: "task123" },
      user: {
        _id: "user123",
        workspaceId: "workspace123",
      },
      body: {
        title: "Updated Task",
      },
    };

    const res = createResponse();

    updateTask.mockResolvedValue({
      _id: "task123",
      title: "Updated Task",
    });

    await updateTaskController(req, res);

    expect(updateTask).toHaveBeenCalledWith(
      "task123",
      "user123",
      "workspace123",
      req.body
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should delete task", async () => {
    const req = {
      params: { taskId: "task123" },
      user: {
        _id: "user123",
      },
    };

    const res = createResponse();

    deleteTask.mockResolvedValue({
      _id: "task123",
    });

    await deleteTaskController(req, res);

    expect(deleteTask).toHaveBeenCalledWith(
      "task123",
      req.user
    );

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should move task", async () => {
    const req = {
      params: { taskId: "task123" },
      body: {
        columnId: "column456",
        order: 2,
      },
      user: {
        _id: "user123",
      },
      app: {
        get: jest.fn().mockReturnValue({
          emit: jest.fn(),
        }),
      },
    };

    const res = createResponse();

    const task = {
      _id: "task123",
      title: "Test Task",
      boardId: "board123",
      workspaceId: "workspace123",
    };

    const sourceColumn = {
      _id: "column123",
      name: "Todo",
    };

    const targetColumn = {
      _id: "column456",
      name: "Done",
    };

    moveTask.mockResolvedValue({
      task,
      sourceColumn,
      targetColumn,
    });

    await moveTaskController(req, res);

    expect(moveTask).toHaveBeenCalledWith(
      "task123",
      "column456",
      2
    );

    expect(req.app.get).toHaveBeenCalledWith("io");
    expect(addAuditLog).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});