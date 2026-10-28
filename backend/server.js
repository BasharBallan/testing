// server.js

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");
const logger = require("./utils/logger");
const { initSocketServer } = require("./socket/socket");

// ------------------------------------------------------
// Load environment variables
// ------------------------------------------------------
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: "config.env.test" });
  logger.transports.forEach((t) => (t.silent = true));
} else {
  dotenv.config({ path: "config.env" });
}

// ------------------------------------------------------
// Connect to MongoDB
// ------------------------------------------------------
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => logger.info("📦 MongoDB connected successfully"))
    .catch((err) => {
      logger.error(`❌ DB connection error: ${err.message}`, { stack: err.stack });
    });
}

// ------------------------------------------------------
// Create raw HTTP server & Socket.IO
// ------------------------------------------------------
const httpServer = http.createServer(app);
const io = initSocketServer(httpServer);
global.io = io; // Used across controllers via global.io

// ------------------------------------------------------
// Start server locally (Skipped on Vercel Serverless)
// ------------------------------------------------------
const PORT = process.env.PORT || 8000;

if (!process.env.VERCEL) {
  httpServer.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server + Socket.IO running on port ${PORT} (0.0.0.0)`);
  });
}

// ------------------------------------------------------
// Handle unhandled promise rejections
// ------------------------------------------------------
process.on("unhandledRejection", (err) => {
  logger.error(`💥 UnhandledRejection: ${err.name} | ${err.message}`, {
    stack: err.stack,
  });
});

// ------------------------------------------------------
// Handle uncaught exceptions
// ------------------------------------------------------
process.on("uncaughtException", (err) => {
  logger.error(`💥 UncaughtException: ${err.name} | ${err.message}`, {
    stack: err.stack,
  });
});

// ------------------------------------------------------
// Export app for Vercel Serverless deployment
// ------------------------------------------------------
module.exports = app;
