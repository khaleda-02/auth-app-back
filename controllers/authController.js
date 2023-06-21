const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { sendEmail } = require('../util/sendEmail');

const cookiesExpireTime = 24 * 60 * 60 * 1000; // one day in milliseconds
const firebaseApp = initializeApp(
  { projectId: process.env.FIREBASE_PROJECT_ID }
);

//TODO: VAILDATE THE USER INPUTS .  

const tokenGenrator = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

const OTPCodeGenerator = () => {
  return Math.floor(Math.random() * 9000 + 1000);
}

//! make it middleware 
const addCredintionailsRes = (res) => {
  res.status(400);
  throw new Error("add credintionals ..")
}

// @des    login
// @route  GET /api/auth/login
// @access public
const login = asyncHandler(
  async (req, res) => {
    const { email, password, googleToken } = req.body;
    let user = null;
    let verified = false;

    if (googleToken) {
      decoded = await getAuth().verifyIdToken(googleToken);
      user = await User.findOne({ email: decoded.email })
      verified = true && user;
    } else if (email && password) {
      user = await User.findOne({ email });
      //! حطينا اليوزر تحت عشان لما انا ادخل ايميل غلط , الكود اللي فوق رح يرجع نل و 
      //! وبالتالي في الكود تحت ما رح يقدر يقرا من نل و رح يرجع ايرور مش مفهوم 
      verified = user && await bcrypt.compare(password, user.password);
    } else {
      addCredintionailsRes(res);
    }

    if (verified) {
      res
        .cookie('token', tokenGenrator(user._id), { httpOnly: true, expire: new Date() + cookiesExpireTime })
        .status(200)
        .json({
          _id: user._id,
          email: user.email,
          username: user.username,
          // accessToken: tokenGenrator(user._id)
        })
    } else {
      res.status(401);
      throw new Error('unauthorized');
    }
  }
)

// @des    register 
// @route  POST /api/auth/register
// @access public
const register = asyncHandler(async (req, res) => {

  const { username, email, password, googleToken } = req.body;
  let userToReturn = null;
  let userExists = null;
  let verified = false;

  if (googleToken) {
    let decoded = await getAuth().verifyIdToken(googleToken);
    userExists = await User.findOne({ email: decoded.email });
    userToReturn = !userExists && await User.create({
      email: decoded.email,
      username: decoded.name,
    });
    verified = true && !userExists;

  } else if (username && email && password) {
    userExists = await User.findOne({ email: email });
    userToReturn = !userExists && await User.create({
      email,
      username,
      password: await bcrypt.hash(password, 12)
    });
    verified = true && !userExists;

  } else {
    addCredintionailsRes(res);
  }

  if (verified) {
    res
      .cookie('token', tokenGenrator(userToReturn._id), { httpOnly: true, expire: new Date() + cookiesExpireTime })
      .status(200)
      .json({
        _id: userToReturn._id,
        email: userToReturn.email,
        username: userToReturn.username,
      })
  } else {
    res.status(400)
    throw new Error('the user is already exist ')
  }
})


// @des    logout
// @route  get /api/auth/logout
// @access public
const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie('token')
    .status(200)
    .json({ message: 'logout successful' })
})

// @des    register 
// @route  POST /api/auth/isauth
// @access private
const isAuth = (req, res) => {
  res.status(200).json(req.user)
}

// @des    forgot password 
// @route  POST /api/auth/forgot-password/
// @access Public 
const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    addCredintionailsRes(res);
  }
  const OTP = OTPCodeGenerator();
  const user = await User.findOneAndUpdate({ email }, {
    OTP: await bcrypt.hash(`${OTP}`, 12), OTPCodeExpiration: Date.now() + 3600000
  }, { new: true })

  if (!user) {
    res.status(400);
    throw new Error('user not found ');
  }

  await sendEmail({
    from: 'khaleda.02f',
    to: email,
    subject: 'Password Reset', text: `Your password reset code is: ${OTP} , one hour to exiper `
  })

  res.status(200).json({
    status: 'success',
    data: 'email sent successfully ...'
  })
})

// @des    forgot password 
// @route  POST /api/auth/forgot-password/reset
// @access Public 
const resetPassword = asyncHandler(async (req, res) => {
  const { email, OTP, newPassword } = req.body;
  if (!email, !OTP, !newPassword) {
    addCredintionailsRes(res);
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('user not found ');
  }

  if (!await bcrypt.compare(OTP, user.OTP) || user.OTPCodeExpiration < Date.now()) {
    res.status(400);
    throw new Error('expired OTP  ');
  }

  //TODO password vaildation . 
  const updatedUser = await User.updateOne({ email },
    { password: await bcrypt.hash(newPassword, 12) }, { new: true });

  res.status(200).json({
    status: 'success',
    data: 'password reset successfully  '
  })

})

module.exports = { login, register, logout, isAuth, sendOTP, resetPassword }

