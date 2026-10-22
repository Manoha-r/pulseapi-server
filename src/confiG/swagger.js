
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "PulseAPI",
      version: "1.0.0",
      description:
        "REST API documentation for PulseAPI, including authentication, user profile management, and admin operations.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],

    // Display API sections in this order
    tags: [
      {
        name: "Authentication",
        description:
          "User registration, login, logout, and token management",
      },
      {
        name: "User",
        description:
          "User profile, password, and account management",
      },
      {
        name: "Admin",
        description:
          "Administrator-only user management operations",
      },
    ],

    // JWT cookie authentication
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description:
            "JWT access token sent through the HTTP-only token cookie.",
        },
      },
    },
  },

  // Location of Swagger JSDoc comments
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
