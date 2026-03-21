// Routes xác thực — register, login, me, updateProfile, changePassword
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Tên không được trống'),
  body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu ít nhất 6 ký tự'),
];

const loginRules = [
  body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
  body('password').notEmpty().withMessage('Mật khẩu không được trống'),
];

router.post('/register', registerRules, AuthController.register);
router.post('/login', loginRules, AuthController.login);
router.get('/me', authenticate, AuthController.me);
router.put('/profile', authenticate, upload.single('avatar'), AuthController.updateProfile);
router.put('/change-password', authenticate, AuthController.changePassword);

module.exports = router;
