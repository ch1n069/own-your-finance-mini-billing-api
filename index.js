require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./src/models");
const { errorHandler, notFound } = require("./src/middleware/errorHandler");
const healthRoutes = require("./src/routes/health");
const authRoutes = require("./src/routes/auth");
const billRoutes = require("./src/routes/bills");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bills", billRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync database (in development only)
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Syncing database...");
      // await db.sequelize.sync({ alter: true });
      console.log("✅ Database synced.");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      // console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      // console.log(`🔗 Test DB: http://localhost:${PORT}/test-db`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
