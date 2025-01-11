const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { OTPCodeGenerator } = require('./generators');
const { sendEmail } = require('./sendEmail');

const sendOTP = async (email, options) => {
  try {
    const OTP = OTPCodeGenerator();
    const user = await User.findOneAndUpdate({ email }, {
      OTP: await bcrypt.hash(`${OTP}`, 12), OTPCodeExpiration: Date.now() + 3600000
    }, { new: true })

    if (!user) {
      res.status(400);
      throw new Error('user not found ');
    }
    await sendEmail({
      ...options,
      from: 'W',
      to: email,
      text: `Your code is: ${OTP} , one hour to exiper `
    })

  } catch (error) { throw new Error(error) }
}

module.exports = { sendOTP };