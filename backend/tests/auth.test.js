import { jest } from "@jest/globals";

const register = jest.fn();
const login = jest.fn();

jest.unstable_mockModule("../src/service/auth.service.js", () => ({
  default: {
    register,
    login,
    refresh: jest.fn(),
    logout: jest.fn(),
  },
}));

const { default: app } = await import("../app.js");
const request = (await import("supertest")).default;

describe("Auth", () => {
  it("should register user", async () => {
    register.mockResolvedValue({
      id: "123",
      name: "Test User",
      email: "test@example.com",
    });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "Test@12345",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
  });

  it("should login user", async () => {
    login.mockResolvedValue({
      user: {
        _id: "123",
        name: "Test User",
        email: "test@example.com",
      },
      workspace: null,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "Test@12345",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.accessToken).toBe("access-token");
  });
});