const express = require("express");
const router = express.Router();
const { healthCheck, testDbConnection } = require("../controllers/health.controller");

// GET /health - Health check endpoint
router.get("/", healthCheck);

// GET /test-db - Test database connection
router.get("/test-db", testDbConnection);

module.exports = router;
