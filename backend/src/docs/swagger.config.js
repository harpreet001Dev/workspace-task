import express from "express";
import swaggerUi from "swagger-ui-express";
import openapiSpecification from "./openapi.js";

const router = express.Router();

const swaggerUiOptions = {
  customSiteTitle: "Workspace & Project Management API Documentation",
  customCss: `
    .swagger-ui .topbar { display: flex; align-items: center; background-color: #1e293b; padding: 10px 20px; }
    .swagger-ui .topbar .wrapper .topbar-wrapper { display: flex; align-items: center; }
    .swagger-ui .topbar-wrapper a span { font-size: 1.2rem; font-weight: bold; color: #38bdf8; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { font-size: 2rem; color: #0f172a; }
    .swagger-ui .btn.authorize { background-color: #0284c7; color: #ffffff; border-color: #0284c7; }
    .swagger-ui .btn.authorize svg { fill: #ffffff; }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: "list",
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
  },
};

// Raw JSON spec endpoint
router.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openapiSpecification);
});

// Swagger UI mount
router.use("/", swaggerUi.serve, swaggerUi.setup(openapiSpecification, swaggerUiOptions));

export default router;
