import { jest } from "@jest/globals";

const findById = jest.fn();
const findOne = jest.fn();

jest.unstable_mockModule("../src/models/User.js", () => ({
  default: {
    findById,
  },
}));

jest.unstable_mockModule("../src/models/WorkspaceMember.js", () => ({
  default: {
    findOne,
  },
}));

const jwtVerify = jest.fn();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jwtVerify,
  },
}));

const { default: authenticateUser } =
  await import("../src/middleware/auth.middleware.js");

describe("Auth Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reject request without authorization header", async () => {
    const req = {
      headers: {},
    };

    const res = {};
    const next = jest.fn();

    await authenticateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it("should reject invalid authorization format", async () => {
    const req = {
      headers: {
        authorization: "InvalidToken",
      },
    };

    const res = {};
    const next = jest.fn();

    await authenticateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it("should authenticate user without workspace", async () => {
    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    const res = {};
    const next = jest.fn();

    jwtVerify.mockReturnValue({
      id: "user123",
      role: "owner",
      workspaceId: null,
    });

    findById.mockResolvedValue({
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
    });

    await authenticateUser(req, res, next);

    expect(findById).toHaveBeenCalledWith("user123");
    expect(req.user).toEqual({
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      workspaceId: null,
      role: "owner",
    });

    expect(next).toHaveBeenCalledWith();
  });

  it("should reject when user does not exist", async () => {
    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    const res = {};
    const next = jest.fn();

    jwtVerify.mockReturnValue({
      id: "user123",
      workspaceId: null,
    });

    findById.mockResolvedValue(null);

    await authenticateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it("should authenticate workspace member", async () => {
    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    const res = {};
    const next = jest.fn();

    jwtVerify.mockReturnValue({
      id: "user123",
      workspaceId: "workspace123",
    });

    findById.mockResolvedValue({
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
    });

    findOne.mockResolvedValue({
      userId: "user123",
      workspaceId: "workspace123",
      role: "member",
    });

    await authenticateUser(req, res, next);

    expect(findOne).toHaveBeenCalledWith({
      userId: "user123",
      workspaceId: "workspace123",
    });

    expect(req.user).toEqual({
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      workspaceId: "workspace123",
      role: "member",
    });

    expect(next).toHaveBeenCalledWith();
  });

  it("should reject user who is not a workspace member", async () => {
    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    const res = {};
    const next = jest.fn();

    jwtVerify.mockReturnValue({
      id: "user123",
      workspaceId: "workspace123",
    });

    findById.mockResolvedValue({
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
    });

    findOne.mockResolvedValue(null);

    await authenticateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it("should handle expired token", async () => {
    const req = {
      headers: {
        authorization: "Bearer expired-token",
      },
    };

    const res = {};
    const next = jest.fn();

    const error = new Error("Token expired");
    error.name = "TokenExpiredError";

    jwtVerify.mockImplementation(() => {
      throw error;
    });

    await authenticateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it("should handle invalid token", async () => {
    const req = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };

    const res = {};
    const next = jest.fn();

    jwtVerify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await authenticateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });
});