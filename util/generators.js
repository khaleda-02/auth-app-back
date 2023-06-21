const jwt = require('jsonwebtoken');

const tokenGenrator = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

const OTPCodeGenerator = () => {
  return Math.floor(Math.random() * 9000 + 1000);
}

module.exports = { tokenGenrator, OTPCodeGenerator }