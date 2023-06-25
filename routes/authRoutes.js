const { Router } = require('express')
const { login, register, logout, isAuth, sendResetPasswordOTP, resetPassword, sendVerifyUserOTP, verifyUser } = require('../controllers/authController');
const authenticateUser = require('../middleware/authMiddleware');
const router = Router();

router
  .post('/login', login)
  .post('/register', register)

  //! ForgotPassword Feature 
  .post('/forgot-password/', sendResetPasswordOTP)
  // OR : GET /forgot-password/?email=khaledalkhalili@gmial.com 
  .post('/forgot-password/reset', resetPassword)

  //! VerifyUser Feature 
  .get('/verify', authenticateUser, sendVerifyUserOTP)
  .post('/verify', authenticateUser, verifyUser)

  //! Others 
  .get('/logout', logout)
  .get('/isauth', authenticateUser, isAuth)

module.exports = router;