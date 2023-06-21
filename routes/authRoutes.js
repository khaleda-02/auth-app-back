const { Router } = require('express')
const { login, register, logout, isAuth, sendOTP, resetPassword } = require('../controllers/authController');
const verify = require('../middleware/authMiddleware');
const router = Router();

router
  .post('/login', login)
  .post('/register', register)
  .post('/forgot-password/', sendOTP)
  .post('/forgot-password/reset', resetPassword)
  .get('/logout', logout)
  .get('/isauth', verify, isAuth)


module.exports = router;