const express = require("express");
const router = express.Router();
const {
  createBill,
  getBills,
  updateBill,
  deleteBill
} = require("../controllers/bill.controller");
const { authenticate } = require("../middleware/auth");

// All bill routes require authentication
router.use(authenticate);

// POST /api/v1/bills - Create a new bill
router.post("/", createBill);

// GET /api/v1/bills - List bills with filters and pagination
router.get("/", getBills);

// PATCH /api/v1/bills/:id - Update a bill
router.patch("/:id", updateBill);

// DELETE /api/v1/bills/:id - Delete a bill
router.delete("/:id", deleteBill);

module.exports = router;
