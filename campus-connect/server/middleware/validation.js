const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('university')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('University name must be between 2 and 100 characters'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Event title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Event description must be between 10 and 1000 characters'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('location')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters'),
  body('category')
    .isIn(['workshop', 'study-group', 'social', 'academic', 'sports', 'other'])
    .withMessage('Please select a valid category'),
  handleValidationErrors
];

const validateStudyGroup = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Study group name must be between 3 and 100 characters'),
  body('subject')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Subject must be between 2 and 50 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('maxMembers')
    .isInt({ min: 2, max: 50 })
    .withMessage('Max members must be between 2 and 50'),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateEvent,
  validateStudyGroup,
  handleValidationErrors
};