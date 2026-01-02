const Validator = require("fastest-validator");
const v = new Validator();

const createBillSchema = {
  name: {
    type: "string",
    min: 3,
    max: 255,
    messages: {
      stringMin: "Bill name must be at least 3 characters",
      stringMax: "Bill name must not exceed 255 characters",
    },
  },
  amount: {
    type: "number",
    positive: true,
    messages: {
      numberPositive: "Amount must be a positive number",
    },
  },
  due_date: {
    type: "string",
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    messages: {
      stringPattern: "Due date must be in YYYY-MM-DD format",
    },
  },
  category: {
    type: "string",
    min: 1,
    max: 100,
    messages: {
      stringMin: "Category is required",
      stringMax: "Category must not exceed 100 characters",
    },
  },
  status: {
    type: "enum",
    values: ["pending", "paid", "overdue", "cancelled"],
    optional: true,
  },
};

const updateBillSchema = {
  name: { type: "string", min: 3, max: 255, optional: true },
  amount: { type: "number", positive: true, optional: true },
  due_date: { type: "string", pattern: /^\d{4}-\d{2}-\d{2}$/, optional: true },
  category: { type: "string", min: 1, max: 100, optional: true },
  status: {
    type: "enum",
    values: ["pending", "paid", "overdue", "cancelled"],
    optional: true,
  },
};

module.exports = {
  createBillSchema,
  updateBillSchema,
};
