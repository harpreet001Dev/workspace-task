export const authPaths = {
  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      description: "Registers a new user with name, email, and a secure password.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterRequest",
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error (invalid email format, weak password, etc.)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationErrorResponse",
              },
            },
          },
        },
        409: {
          description: "User already exists",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      description:
        "Authenticates user credentials, returns an access token in the response body, and sets a secure httpOnly refresh token cookie.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "User logged in successfully",
          headers: {
            "Set-Cookie": {
              description: "httpOnly refresh token cookie",
              schema: {
                type: "string",
                example: "refreshToken=eyJhbGciOiJIUzI1Ni...; Path=/; HttpOnly; SameSite=Strict",
              },
            },
          },
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginResponse",
              },
            },
          },
        },
        400: {
          description: "Missing or invalid email/password format",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationErrorResponse",
              },
            },
          },
        },
        401: {
          description: "Invalid credentials or user not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/auth/refresh": {
    post: {
      tags: ["Auth"],
      summary: "Refresh access token",
      description:
        "Generates a new access token and rotates the refresh token using the httpOnly refreshToken cookie.",
      security: [
        {
          CookieAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Access token refreshed successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshResponse",
              },
            },
          },
        },
        401: {
          description: "Refresh token missing, invalid, or expired",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/api/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout user",
      description: "Revokes the active refresh token and clears the refreshToken cookie.",
      security: [
        {
          CookieAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Logged out successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LogoutResponse",
              },
            },
          },
        },
        401: {
          description: "Refresh token missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};
