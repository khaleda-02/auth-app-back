const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verify = asyncHandler(async (req, res, next) => {
  let token;

  let header = req.headers.authorization;
  if (header && header.startsWith('Bearer')) {
    token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id: decoded.id }).select('-password');
    next();
  } else {
    res.status(401);
    throw new Error('unauthorized , missing token')
  }
})

module.exports = verify;