import { jest } from "@jest/globals";

const createWorkspace = jest.fn();
const createInvite = jest.fn();
const acceptInvite = jest.fn();
const getWorkspaceUsers = jest.fn();

jest.unstable_mockModule("../src/service/workspace.service.js", () => ({
  default: {
    createWorkspace,
    createInvite,
    acceptInvite,
    getWorkspaceUsers,
  },
}));

const findById = jest.fn();

jest.unstable_mockModule("../src/models/User.js", () => ({
  default: {
    findById,
  },
}));

const workspaceFindById = jest.fn();

jest.unstable_mockModule("../src/models/Workspace.js", () => ({
  default: {
    findById: workspaceFindById,
  },
}));

const { createWorkspace: createWorkspaceController } =
  await import("../src/controllers/workspace.controller.js");

const {
  createInvite: createInviteController,
  acceptInvite: acceptInviteController,
  getWorkspaceUsers: getWorkspaceUsersController,
} = await import("../src/controllers/workspace.controller.js");

describe("Workspace Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create workspace", async () => {
    const req = {
      user: { _id: "user123" },
      body: {
        name: "Test Workspace",
        description: "Test Description",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    createWorkspace.mockResolvedValue({
      _id: "workspace123",
      name: "Test Workspace",
      description: "Test Description",
    });

    findById.mockResolvedValue({
      generateAccessToken: jest.fn().mockReturnValue("access-token"),
    });

    await createWorkspaceController(req, res);

    expect(createWorkspace).toHaveBeenCalledWith(
      "user123",
      req.body
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should create invite", async () => {
    const req = {
      user: {
        _id: "user123",
        workspaceId: "workspace123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    createInvite.mockResolvedValue({
      token: "invite-token",
    });

    await createInviteController(req, res);

    expect(createInvite).toHaveBeenCalledWith(
      "workspace123",
      "user123"
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("should accept invite", async () => {
    const req = {
      params: {
        token: "invite-token",
      },
      user: {
        _id: "user123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    acceptInvite.mockResolvedValue({
      workspaceId: "workspace123",
      member: {
        userId: "user123",
      },
    });

    findById.mockResolvedValue({
      generateAccessToken: jest.fn().mockReturnValue("access-token"),
    });

    workspaceFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "workspace123",
        name: "Test Workspace",
      }),
    });

    await acceptInviteController(req, res);

    expect(acceptInvite).toHaveBeenCalledWith(
      "invite-token",
      "user123"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should get workspace users", async () => {
    const req = {
      user: {
        _id: "user123",
        workspaceId: "workspace123",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getWorkspaceUsers.mockResolvedValue([
      {
        _id: "user123",
        name: "Test User",
      },
    ]);

    await getWorkspaceUsersController(req, res);

    expect(getWorkspaceUsers).toHaveBeenCalledWith(
      "workspace123",
      "user123"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});