const { createTransport } = require('nodemailer')
//TODO store user & pass into .env

const transport = createTransport({
  service: 'Gmail',
  auth: {
    user: "khaleda.02f@gmail.com", pass: "kizzzwntxcfrniaz"
  }
})

const sendEmail = async (options) => {
  try {
    await transport.sendMail(options)
  } catch (error) { throw new Error('sending email error ') }
}

module.exports = { sendEmail };