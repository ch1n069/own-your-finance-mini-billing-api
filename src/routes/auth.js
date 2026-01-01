const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

// POST /auth/login - Authenticate user and return JWT
router.post("/auth/login", login);

module.exports = router;
