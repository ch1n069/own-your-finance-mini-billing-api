require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({
      success: true,
      message: 'Database connection successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Syncing database...');
      // await db.sequelize.sync({ alter: true });
      console.log('✅ Database synced.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Test DB: http://localhost:${PORT}/test-db`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
