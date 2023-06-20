const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//! when the token stored with the cookies case
const verify = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token; // token => token without bearer
  if (!token) {
    res.status(401);
    throw new Error('unauthorized , missing token')
  }

  try {
    const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id: userDecoded.id }).select('_id email username');
    next();
  } catch (erro) {
    res
      .clearCookie('token')
      .status(401);
    throw new Error('unauthorized , invalid token');
  }

})


//! when the token stored with the client side case
// const verify = asyncHandler(async (req, res, next) => {
//   let token;
//   //!getting the token
//   let header = req.headers.authorization;
//   if (header && header.startsWith('Bearer')) {
//     token = header.split(' ')[1];
//     //! validate the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findOne({ _id: decoded.id }).select('-password');
//     next();
//   } else {
//     res.status(401);
//     throw new Error('unauthorized , missing token')
//   }
// })

module.exports = verify;