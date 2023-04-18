const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtGenrator = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}


// @des    login
// @route  GET /auth/login
// @access public
const login = asyncHandler(
  async (req, res) => {
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
        accessToken: jwtGenrator(user._id)
      })
    } else {
      res.status(401);
      throw new Error('unauthorized');
    }
  }
)

// @des    register 
// @route  POST /auth/register
// @access public
const register = asyncHandler(async (req, res) => {
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
      accessToken: jwtGenrator(user._id)
    })
  } else {
    res.status(400)
    throw new Error('the user is already exist ')
  }
})


// @des    register 
// @route  POST /auth/register
// @access private
const isAuth = (req, res) => {
  res.status(200).json(req.user)
}
module.exports = { login, register, isAuth }