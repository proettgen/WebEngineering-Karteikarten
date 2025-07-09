import express from "express";
import folderRoutes from "../src/routes/folderRoutes";
import cardRoutes from "../src/routes/cardRoutes";
import analyticsRoutes from "../src/routes/analyticsRoutes";
import { globalErrorHandler } from "../src/utils/errorHandler";
import { AppError } from "../src/utils/AppError";
import fs from "fs";
import path from "path";
import "dotenv/config";
import authRoutes from "../src/routes/authRoutes";
import cookieParser from "cookie-parser";

const app = express();


// CORS middleware - MUST be before other routes
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://proettgen.github.io",
    "https://proettgen.github.io/WebEngineering-Karteikarten/",
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.some((o) => origin.startsWith(o))) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

app.use(cookieParser());
app.use(express.json());

// Health check endpoint
app.get("/", (_, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend is running successfully!",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/folders", folderRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/auth", authRoutes);
// Analytics routes: Provides endpoints for learning statistics (see src/routes/analyticsRoutes.ts)
app.use("/api/analytics", analyticsRoutes);

// Swagger documentation routes
app.get("/api/api-docs/swagger.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Try to load generated swagger file (created by build script)
  const generatedSwaggerPath = path.join(
    __dirname,
    "../src/swagger/generated-swagger.json",
  );

  try {
    if (fs.existsSync(generatedSwaggerPath)) {
      const generatedSwagger = fs.readFileSync(generatedSwaggerPath, "utf8");
      const parsedSwagger = JSON.parse(generatedSwagger) as Record<
        string,
        unknown
      >;
      console.log("📄 Serving generated Swagger documentation");
      res.json(parsedSwagger);
      return;
    }
  } catch (error) {
    console.warn(
      "⚠️  Failed to load generated swagger file:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
});

app.get("/api/api-docs", (_req, res) => {
  const swaggerUrl = `https://petstore.swagger.io/?url=${encodeURIComponent("https://web-engineering-karteikarten.vercel.app/api/api-docs/swagger.json")}`;
  res.redirect(swaggerUrl);
});

// Catch-all route for 404 Not Found errors
app.all("*", (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start the server (only when not in Vercel environment)
if (process.env.NODE_ENV !== "production") {
  const startServer = (port: number) => {
    app
      .listen(port)
      .on("listening", () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
      })
      .on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
          console.log(
            `Port ${port} is already in use, trying port ${port + 1}`,
          );
          startServer(port + 1);
        } else {
          console.error("Server error:", err);
        }
      });
  };

  startServer(8080);
}

// Export for Vercel serverless functions
export default app;
