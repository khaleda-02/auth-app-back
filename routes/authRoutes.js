const { Router } = require('express')
const { login, register, isAuth } = require('../controllers/authController');
const verify = require('../middleware/authMiddleware');
const router = Router();
  
router
  .post('/login', login)
  .post('/register', register)
  .get('/isauth', verify, isAuth)


module.exports = router;