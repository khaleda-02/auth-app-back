const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//! when the token stored with the client side case
const authenticateUser = asyncHandler(async (req, res, next) => {
  let token;
  //!getting the token
  let header = req.headers.authorization;
  if (header && header.startsWith('Bearer')) {
    console.log(header);
    token = header.split(' ')[1];
    console.log(token);
    if (!token) {
      res.status(401);
      throw new Error('unauthorized , missing token')
    }
    //! validate the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id: decoded.id }).select('_id email username verified');
    next();
  } else {
    res.status(401);
    throw new Error('unauthorized , missing token')
  }
})

//! when the token stored with the cookies case
// const authenticateUser = asyncHandler(async (req, res, next) => {
//   let token = req.cookies.token; // token => token without bearer
//   if (!token) {
//     res.status(401);
//     throw new Error('unauthorized , missing token')
//   }

//   try {
//     const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findOne({ _id: userDecoded.id }).select('_id email username verified');
//     next();
//     //? when we sign the token , we just pass the id without ( email , username , verified ) , becase we need those field up-to-date when I visit protected routes 
//   } catch (erro) {
//     res
//       .clearCookie('token')
//       .status(401);
//     throw new Error('unauthorized , invalid token');
//   }

// })



module.exports = authenticateUser;