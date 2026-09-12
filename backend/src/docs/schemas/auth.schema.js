export const authSchemas = {
  RegisterRequest: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        minLength: 3,
        example: "John Doe",
        description: "Full name of the user (minimum 3 characters)",
      },
      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
        description: "Valid email address",
      },
      password: {
        type: "string",
        format: "password",
        minLength: 8,
        example: "Password@123",
        description:
          "Strong password with at least 8 characters, containing 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      },
    },
  },

  RegisterResponse: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "success",
      },
      message: {
        type: "string",
        example: "User registered successfully",
      },
      data: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "6701a2b3c4d5e6f7a8b9c0d1",
          },
          name: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            example: "john@example.com",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-09-12T10:00:00.000Z",
          },
        },
      },
    },
  },

  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },
      password: {
        type: "string",
        format: "password",
        example: "Password@123",
      },
    },
  },

  LoginResponse: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "success",
      },
      data: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              _id: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d1" },
              name: { type: "string", example: "John Doe" },
              email: { type: "string", example: "john@example.com" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          workspace: {
            type: "object",
            nullable: true,
            properties: {
              _id: { type: "string", example: "6701a2b3c4d5e6f7a8b9c0d2" },
              name: { type: "string", example: "Development Team" },
              role: { type: "string", enum: ["owner", "member"], example: "owner" },
            },
          },
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            description: "JWT access token valid for 15 minutes",
          },
        },
      },
    },
  },

  RefreshResponse: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "success",
      },
      data: {
        type: "object",
        properties: {
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
    },
  },

  LogoutResponse: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "success",
      },
      message: {
        type: "string",
        example: "Logged out successfully",
      },
    },
  },
};
