const { sendEmail } = require('./sendEmail')
const { registerValidator } = require('./validator')
module.exports = {
  sendEmail,
  registerValidator ,
  generators: require('./generators')
}