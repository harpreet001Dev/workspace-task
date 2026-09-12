import { jest } from "@jest/globals";

const register = jest.fn();
const login = jest.fn();
const refresh = jest.fn();
const logout = jest.fn();

jest.unstable_mockModule("../src/service/auth.service.js", () => ({
  default: {
    register,
    login,
    refresh,
    logout,
  },
}));

const {
  refresh: refreshController,
  logout: logoutController,
} = await import("../src/controllers/auth.contoller.js");

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  });

  it("should refresh access token", async () => {
    const req = {
      cookies: {
        refreshToken: "old-refresh-token",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    refresh.mockResolvedValue({
      accessToken: "new-access-token",
      newRefreshToken: "new-refresh-token",
    });

    await refreshController(req, res, next);

    expect(refresh).toHaveBeenCalledWith("old-refresh-token");

    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "new-refresh-token",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: {
        accessToken: "new-access-token",
      },
    });
  });

  it("should reject refresh when token is missing", async () => {
    const req = {
      cookies: {},
    };

    const res = createResponse();
    const next = jest.fn();

    await refreshController(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("should logout user", async () => {
    const req = {
      cookies: {
        refreshToken: "refresh-token",
      },
    };

    const res = createResponse();
    const next = jest.fn();

    logout.mockResolvedValue({
      message: "Logged out successfully",
    });

    await logoutController(req, res, next);

    expect(logout).toHaveBeenCalledWith("refresh-token");

    expect(res.clearCookie).toHaveBeenCalledWith(
      "refreshToken",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Logged out successfully",
    });
  });

  it("should handle logout error", async () => {
    const req = {
      cookies: {},
    };

    const res = createResponse();
    const next = jest.fn();

    logout.mockRejectedValue({
      statusCode: 401,
      message: "Refresh token is required",
    });

    await logoutController(req, res, next);

    expect(logout).toHaveBeenCalledWith(undefined);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
    expect(res.clearCookie).not.toHaveBeenCalled();
  });
});