const { sendEmail } = require('./sendEmail');
const { sendOTP } = require('./sendOTP');
const { loggerMiddleware } = require('./logger');
const { registerValidator, passwordValidator } = require('./validator');

module.exports = {
  sendEmail,
  registerValidator,
  passwordValidator,
  sendOTP,
  loggerMiddleware,
  generators: require('./generators')
};