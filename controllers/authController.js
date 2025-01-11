const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { registerValidator, passwordValidator, sendOTP } = require('../util/');
const { tokenGenrator } = require('../util/').generators;


const firebaseApp = initializeApp(
  { projectId: process.env.FIREBASE_PROJECT_ID }
);
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
      verified = user && await bcrypt.compare(password, user.password);
    } else {
      addCredintionailsRes(res);
    }

    if (verified) {
      res
        .status(200)
        .json({
          status: 'success',
          message: 'login successfully ',
          data: {
            _id: user._id,
            email: user.email,
            username: user.username,
            token: tokenGenrator(user._id)
          }
        })
    } else {
      res.status(401);
      throw new Error('worng data .');
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
    const { error } = registerValidator({ username, email, password });
    if (error) {
      const message = error.details.map(el => el.message)
      res.status(400);
      throw new Error(message);
    }
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
      .status(200)
      .json({
        status: 'success',
        message: 'register successfully ',
        data: {
          _id: userToReturn._id,
          email: userToReturn.email,
          username: userToReturn.username,
          token: tokenGenrator(userToReturn._id)
        }
      })
  } else {
    res.status(400)
    throw new Error('the user is already exist ')
  }
})

//! VerifyUser FEATURE
// @des    verify user 
// @route  GET /api/auth/verify
// @access private 
const sendVerifyUserOTP = asyncHandler(async (req, res) => {
  const { email, verified } = req.user;
  console.log(req.user)
  if (verified) {
    res.status(400);
    throw new Error('user already verifief');
  }
  const options = {
    subject: 'Verify User',
  };
  await sendOTP(email, options)
  res
    .status(200)
    .json({
      status: 'success',
      message: 'email sent successfully ...'
    })
})

// @des    verify user 
// @route  POST /api/auth/verify
// @access private 
const verifyUser = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { OTP } = req.body;

  const user = await User.findOne({ email });
  if (!await bcrypt.compare(OTP, user.OTP) || user.OTPCodeExpiration < Date.now()) {
    res.status(400);
    throw new Error('invalid OTP  ');
  }
  await User.updateOne({ email },
    { verified: true });

  res.status(200).json({
    status: 'success',
    message: 'user verified   '
  })

})



//! ForgotPassword FEATURE 
// @des    forgot password 
// @route  POST /api/auth/forgot-password/
// @access Public 
const sendResetPasswordOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    addCredintionailsRes(res);
  }

  const options = {
    subject: 'Password Reset',
  };

  await sendOTP(email, options)
  res
    .status(200)
    .json({
      status: 'success',
      message: 'email sent successfully ...'
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
    throw new Error('invalid OTP  ');
  }
  const { error } = passwordValidator({ newPassword });
  if (error) {
    const message = error.details.map(el => el.message)
    res.status(400);
    throw new Error(message);
  }
  await User.updateOne({ email },
    { password: await bcrypt.hash(newPassword, 12) }, { new: true });

  res.status(200).json({
    status: 'success',
    message: 'password reset successfully  '
  })
})


//! Others FEATURES
// @des    logout
// @route  get /api/auth/logout
// @access public
const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      message: 'logout successful',
      data: {}
    })
})

// @des    register 
// @route  POST /api/auth/isauth
// @access private
const isAuth = (req, res) => {
  res.status(200).json(req.user)
}


module.exports = { login, register, logout, isAuth, sendResetPasswordOTP, resetPassword, sendVerifyUserOTP, verifyUser }