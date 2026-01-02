const validateRequest = (validator) => {
  return (req, res, next) => {
    const result = validator(req.body);

    if (result !== true) {
      const errors = result.map(error => ({
        field: error.field,
        message: error.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    next();
  };
};

module.exports = { validateRequest };
