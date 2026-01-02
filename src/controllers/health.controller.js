const db = require('../models');

const healthCheck = (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};

const testDbConnection = async (req, res) => {
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
};

module.exports = {
  healthCheck,
  testDbConnection
};
