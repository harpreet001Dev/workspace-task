export const commonSchemas = {
  ErrorResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      message: {
        type: "string",
        example: "An error occurred while processing the request",
      },
      errors: {
        type: "array",
        items: {
          type: "string",
        },
        example: [],
      },
    },
  },

  ValidationErrorResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      message: {
        type: "string",
        example: "Validation error",
      },
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            field: {
              type: "string",
              example: "email",
            },
            message: {
              type: "string",
              example: "\"email\" must be a valid email",
            },
          },
        },
      },
    },
  },

  SuccessMessageResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Operation completed successfully",
      },
    },
  },
};
