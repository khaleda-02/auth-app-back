const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const firebaseApp = initializeApp(
  { projectId: process.env.FIREBASE_PROJECT_ID }
);

//TODO: test , signup with google , then logout , then login with email and password but the email is the google email 
//! MAKE THE COOKIES EXPIRE TIME AS SAME AS THE TOKEN EXPIRE TIME . 
//TODO: VAILDATE THE USER INPUTS .  

const tokenGenrator = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}

// @des    login
// @route  GET /api/auth/login
// @access public
const login = asyncHandler(
  async (req, res) => {
    // now . want to know the typeof the login operation .
    const { googleToken } = req.body;
    if (googleToken) {
      const user = await getAuth().verifyIdToken(googleToken);
      if (user && await User.findOne({ email: user.email })) {
        res.status(200).json({
          _id: user._id,
          email: user.email,
          username: user.username,
          accessToken: tokenGenrator(user._id)
        })
      } else {
        res.status(401);
        throw new Error('unauthorized');
      }
    }
    else {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400)
        throw new Error('add all fields ...');
      }
      //check for user email
      const user = await User.findOne({ email });
      if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
          _id: user._id,
          email: user.email,
          username: user.username,
          accessToken: tokenGenrator(user._id)
        })
      } else {
        res.status(401);
        throw new Error('unauthorized');
      }
    }
  }
)

// @des    register 
// @route  POST /api/auth/register
// @access public
const register = asyncHandler(async (req, res) => {
  console.log('in register');
  const { googleToken } = req.body;
  if (googleToken) {
    console.log('in register google tokenb block');
    const user = await getAuth().verifyIdToken(googleToken);
    console.log('user', user);
    if (user && !await User.findOne({ email: user.email })) {
      console.log('inside if , user was is creating')
      const newUser = await User.create({
        email: user.email,
        username: user.name,
      })
      console.log('registered user')
      res.status(200).json({
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        accessToken: tokenGenrator(newUser._id)
      })
    } else {
      console.log('inside else , user was not created')
      res.status(400)
      throw new Error('the user is already exist ')
    }
  } else {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error('add credintional ');
    }
    //check if the user exist 
    const userExists = await User.findOne({ email });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        email,
        username,
        password: hashedPassword
      })
      res.status(200).json({
        _id: user._id,
        email: user.email,
        username: user.username,
        accessToken: tokenGenrator(user._id)
      })
    } else {
      res.status(400)
      throw new Error('the user is already exist ')
    }
  }
})


// @des    register 
// @route  POST /api/auth/isauth
// @access private
const isAuth = (req, res) => {
  res.status(200).json(req.user)
}

module.exports = { login, register, isAuth }