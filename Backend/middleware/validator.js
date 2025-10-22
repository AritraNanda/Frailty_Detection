const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Patient validation rules
exports.validatePatient = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('height').optional().isFloat({ min: 0 }).withMessage('Height must be positive'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be positive'),
  body('heartRate').optional().isInt({ min: 0 }).withMessage('Heart rate must be positive'),
  body('respiratoryRate').optional().isInt({ min: 0 }).withMessage('Respiratory rate must be positive')
];

// Doctor validation rules
exports.validateDoctor = [
  body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email format')
];

// Login validation rules
exports.validateLogin = [
  body('employeeId').trim().notEmpty().withMessage('Employee ID is required')
];

// ID validation
exports.validateId = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

// Search validation
exports.validateSearch = [
  query('q').optional().trim().isLength({ min: 1 }).withMessage('Search query must not be empty')
];
