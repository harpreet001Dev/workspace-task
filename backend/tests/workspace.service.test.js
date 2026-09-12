import { jest } from "@jest/globals";

const Workspace = {
  create: jest.fn(),
};

const WorkspaceMember = {
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};

const WorkspaceInvite = {
  create: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
};

const startSession = jest.fn();

jest.unstable_mockModule("../src/models/Workspace.js", () => ({
  default: Workspace,
}));

jest.unstable_mockModule("../src/models/WorkspaceMember.js", () => ({
  default: WorkspaceMember,
}));

jest.unstable_mockModule("../src/models/workspaceInvite.js", () => ({
  default: WorkspaceInvite,
}));

jest.unstable_mockModule("mongoose", () => ({
  default: {
    startSession,
  },
}));

const cryptoRandomBytes = jest.fn();

jest.unstable_mockModule("crypto", () => ({
  default: {
    randomBytes: cryptoRandomBytes,
  },
}));

const { default: workspaceService } = await import(
  "../src/service/workspace.service.js"
);

describe("Workspace Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.FRONTEND_URL = "http://localhost:5173";
  });

  describe("createWorkspace", () => {
    it("should create workspace and owner member", async () => {
      const workspace = {
        _id: "workspace-123",
        name: "Test Workspace",
        description: "Test description",
        ownerId: "user-123",
      };

      const session = {
        withTransaction: jest.fn(async (callback) => {
          await callback();
        }),
        endSession: jest.fn(),
      };

      startSession.mockResolvedValue(session);

      Workspace.create.mockResolvedValue([workspace]);

      WorkspaceMember.create.mockResolvedValue([
        {
          userId: "user-123",
          workspaceId: "workspace-123",
          role: "owner",
        },
      ]);

      const result = await workspaceService.createWorkspace("user-123", {
        name: "Test Workspace",
        description: "Test description",
      });

      expect(startSession).toHaveBeenCalled();

      expect(Workspace.create).toHaveBeenCalledWith(
        [
          {
            name: "Test Workspace",
            description: "Test description",
            ownerId: "user-123",
          },
        ],
        { session }
      );

      expect(WorkspaceMember.create).toHaveBeenCalledWith(
        [
          {
            userId: "user-123",
            workspaceId: "workspace-123",
            role: "owner",
          },
        ],
        { session }
      );

      expect(result).toEqual(workspace);
      expect(session.endSession).toHaveBeenCalled();
    });

    it("should end session when workspace creation fails", async () => {
      const session = {
        withTransaction: jest.fn(async (callback) => {
          await callback();
        }),
        endSession: jest.fn(),
      };

      startSession.mockResolvedValue(session);

      Workspace.create.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        workspaceService.createWorkspace("user-123", {
          name: "Test Workspace",
          description: "Test description",
        })
      ).rejects.toThrow("Database error");

      expect(session.endSession).toHaveBeenCalled();
    });
  });

  describe("createInvite", () => {
    it("should create workspace invite", async () => {
      const workspace = {
        _id: "workspace-123",
      };

      const invite = {
        _id: "invite-123",
        token: "abc123",
        expiresAt: new Date("2030-01-01"),
      };

      Workspace.findById = jest.fn().mockResolvedValue(workspace);

      cryptoRandomBytes.mockReturnValue({
        toString: jest.fn().mockReturnValue("abc123"),
      });

      WorkspaceInvite.create.mockResolvedValue(invite);

      const result = await workspaceService.createInvite(
        "workspace-123",
        "user-123"
      );

      expect(Workspace.findById).toHaveBeenCalledWith("workspace-123");

      expect(cryptoRandomBytes).toHaveBeenCalledWith(32);

      expect(WorkspaceInvite.create).toHaveBeenCalledWith(
        expect.objectContaining({
          workspaceId: "workspace-123",
          invitedBy: "user-123",
          token: "abc123",
        })
      );

      expect(result.inviteId).toBe("invite-123");
      expect(result.token).toBe("abc123");
      expect(result.inviteLink).toBe(
        "http://localhost:5173/invite/abc123"
      );
      expect(result.expiresAt).toEqual(invite.expiresAt);
    });

    it("should reject invite when workspace does not exist", async () => {
      Workspace.findById = jest.fn().mockResolvedValue(null);

      await expect(
        workspaceService.createInvite(
          "workspace-123",
          "user-123"
        )
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Workspace not found",
      });

      expect(WorkspaceInvite.create).not.toHaveBeenCalled();
    });
  });

  describe("acceptInvite", () => {
    it("should accept a valid invitation", async () => {
      const invite = {
        workspaceId: "workspace-123",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        acceptedAt: null,
        save: jest.fn(),
      };

      const member = {
        _id: "member-123",
        workspaceId: "workspace-123",
        userId: "user-123",
        role: "member",
      };

      WorkspaceInvite.findOne = jest.fn().mockResolvedValue(invite);

      WorkspaceMember.findOne = jest.fn().mockResolvedValue(null);

      WorkspaceMember.create.mockResolvedValue(member);

      const result = await workspaceService.acceptInvite(
        "valid-token",
        "user-123"
      );

      expect(WorkspaceInvite.findOne).toHaveBeenCalledWith({
        token: "valid-token",
      });

      expect(WorkspaceMember.findOne).toHaveBeenCalledWith({
        workspaceId: "workspace-123",
        userId: "user-123",
      });

      expect(WorkspaceMember.create).toHaveBeenCalledWith({
        workspaceId: "workspace-123",
        userId: "user-123",
        role: "member",
      });

      expect(invite.save).toHaveBeenCalled();

      expect(result).toEqual({
        workspaceId: "workspace-123",
        member,
      });
    });

    it("should reject invalid invitation", async () => {
      WorkspaceInvite.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        workspaceService.acceptInvite(
          "invalid-token",
          "user-123"
        )
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Invalid invitation",
      });
    });

    it("should reject expired invitation", async () => {
      const invite = {
        expiresAt: new Date(Date.now() - 60 * 1000),
        acceptedAt: null,
      };

      WorkspaceInvite.findOne = jest.fn().mockResolvedValue(invite);

      await expect(
        workspaceService.acceptInvite(
          "expired-token",
          "user-123"
        )
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Invitation has expired",
      });
    });

    it("should reject already used invitation", async () => {
      const invite = {
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        acceptedAt: new Date(),
      };

      WorkspaceInvite.findOne = jest.fn().mockResolvedValue(invite);

      await expect(
        workspaceService.acceptInvite(
          "used-token",
          "user-123"
        )
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "Invitation has already been used",
      });
    });

    it("should reject existing workspace member", async () => {
      const invite = {
        workspaceId: "workspace-123",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        acceptedAt: null,
      };

      WorkspaceInvite.findOne = jest.fn().mockResolvedValue(invite);

      WorkspaceMember.findOne = jest.fn().mockResolvedValue({
        _id: "existing-member",
      });

      await expect(
        workspaceService.acceptInvite(
          "valid-token",
          "user-123"
        )
      ).rejects.toMatchObject({
        statusCode: 400,
        message: "You are already a member of this workspace",
      });

      expect(WorkspaceMember.create).not.toHaveBeenCalled();
    });
  });

  describe("getWorkspaceUsers", () => {
    it("should return workspace users for a member", async () => {
      WorkspaceMember.findOne = jest.fn().mockResolvedValue({
        userId: "user-123",
        workspaceId: "workspace-123",
      });

      const members = [
        {
          userId: {
            _id: "user-123",
            name: "John",
            email: "john@example.com",
          },
          role: "owner",
        },
        {
          userId: {
            _id: "user-456",
            name: "Jane",
            email: "jane@example.com",
          },
          role: "member",
        },
      ];

      const lean = jest.fn().mockResolvedValue(members);

      const populate = jest.fn().mockReturnValue({
        lean,
      });

      WorkspaceMember.find = jest.fn().mockReturnValue({
        populate,
      });

      const result = await workspaceService.getWorkspaceUsers(
        "workspace-123",
        "user-123"
      );

      expect(WorkspaceMember.findOne).toHaveBeenCalledWith({
        workspaceId: "workspace-123",
        userId: "user-123",
      });

      expect(WorkspaceMember.find).toHaveBeenCalledWith({
        workspaceId: "workspace-123",
      });

      expect(populate).toHaveBeenCalledWith(
        "userId",
        "_id name email"
      );

      expect(result).toEqual([
        {
          _id: "user-123",
          name: "John",
          email: "john@example.com",
          role: "owner",
        },
        {
          _id: "user-456",
          name: "Jane",
          email: "jane@example.com",
          role: "member",
        },
      ]);
    });

    it("should reject non-members", async () => {
      WorkspaceMember.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        workspaceService.getWorkspaceUsers(
          "workspace-123",
          "user-123"
        )
      ).rejects.toMatchObject({
        statusCode: 403,
        message: "You are not a member of this workspace",
      });

      expect(WorkspaceMember.find).not.toHaveBeenCalled();
    });
  });
});