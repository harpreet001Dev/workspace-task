import { jest } from "@jest/globals";

const { default: authorizeRole } =
  await import("../src/middleware/role.middleware.js");

describe("Role Middleware", () => {
  it("should reject unauthenticated user", () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    authorizeRole("owner")(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(401);
  });

  it("should reject user with unauthorized role", () => {
    const req = {
      user: {
        role: "member",
      },
    };

    const res = {};
    const next = jest.fn();

    authorizeRole("owner")(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(403);
  });

  it("should allow user with authorized role", () => {
    const req = {
      user: {
        role: "owner",
      },
    };

    const res = {};
    const next = jest.fn();

    authorizeRole("owner")(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});