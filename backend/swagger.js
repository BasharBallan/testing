const path = require("path");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "address",
      version: "1.0.0",
      description: `
# 🔐 Authentication Guide

This API uses **JWT Bearer Tokens** for authentication.
To test protected endpoints, follow the steps below.

---

## 🚀 How to Use Tokens in Swagger

1. Click the **Authorize** button at the top-right corner of the Swagger UI.
2. Enter your token in the following format:

\`\`\`
Bearer YOUR_TOKEN_HERE
\`\`\`

3. Click **Authorize**, then **Close**.
4. Now you can test any protected API.

---



---

## 📌 Notes
- These tokens are for **testing only**.
- Do NOT use them in production environments.
- If you receive a **401 Unauthorized**, make sure you used the correct token for the required role.
- Endpoints specify which role is required (Admin / Doctor / Student).

Enjoy testing your API!
      `,
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: [
      path.join(__dirname, "./modules/**/*.js"),
      path.join(__dirname, "./routes/**/*.js"),
    ],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
