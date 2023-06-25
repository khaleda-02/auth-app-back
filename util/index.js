const { sendEmail } = require('./sendEmail');
const { sendOTP } = require('./sendOTP');
const { registerValidator, passwordValidator } = require('./validator');

module.exports = {
  sendEmail,
  registerValidator,
  passwordValidator,
  sendOTP, 
  generators: require('./generators')
};