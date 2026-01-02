const db = require("../models");
const { Op } = require("sequelize");
const Validator = require("fastest-validator");
const {
  createBillSchema,
  updateBillSchema,
} = require("../validators/bill.validator");
const emailService = require("../services/email.service");

const createBill = async (req, res, next) => {
  const { name, amount, due_date, category, status } = req.body;
  try {
    // Validate request
    const v = new Validator();

    const validationResponse = v.validate(
      { name, amount, due_date, category, status },
      createBillSchema
    );
    if (validationResponse !== true) {
      const errors = validationResponse.map((error) => ({
        field: error.field,
        message: error.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const bill = await db.Bill.create({
      user_id: req.user.id,
      name,
      amount,
      due_date,
      category,
      status: status || "pending",
    });

    console.log(
      `[INFO] Bill created: ID=${bill.id}, Name=${bill.name}, User=${req.user.email}`
    );

    // Send email notification
    try {
      await emailService.sendBillCreatedNotification(bill, req.user);
    } catch (emailError) {
      console.error('[ERROR] Failed to send email notification:', emailError.message);
      // Continue even if email fails - don't block the response
    }

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: bill,
    });
  } catch (error) {
    next(error);
  }
};

const getBills = async (req, res, next) => {
  try {
    const { dueBefore, category, status, page = 1, limit = 10 } = req.query;

    const where = {
      user_id: req.user.id,
    };

    if (dueBefore) {
      where.due_date = {
        [Op.lte]: new Date(dueBefore),
      };
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await db.Bill.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["due_date", "ASC"]],
    });

    res.json({
      success: true,
      message: "Bills retrieved successfully",
      data: {
        bills: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateBill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, amount, due_date, category, status } = req.body;

    // Validate request
    const v = new Validator();
    const validationResult = v.validate(
      { name, amount, due_date, category, status },
      updateBillSchema
    );
    if (validationResult !== true) {
      const errors = validationResult.map((error) => ({
        field: error.field,
        message: error.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const bill = await db.Bill.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (amount !== undefined) updateData.amount = amount;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;

    await bill.update(updateData);

    console.log(`[INFO] Bill updated: ID=${bill.id}, User=${req.user.email}`);

    res.json({
      success: true,
      message: "Bill updated successfully",
      data: bill,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bill = await db.Bill.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    await bill.destroy();

    console.log(`[INFO] Bill deleted: ID=${id}, User=${req.user.email}`);

    res.json({
      success: true,
      message: "Bill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBill,
  getBills,
  updateBill,
  deleteBill,
};
