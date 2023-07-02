
// this middleware jsut for handling the catch block , 
// instadof in each route , make a try/catch blocks to handle the error
// we create the middleware to handle the catch block ,and we jsut throw the error in the controller  
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;

  res.statusCode = statusCode;

  res
    .json({
      status: 'faild',
      message: err.message,
      stack: err.stack
    })
}

module.exports = { errorHandler };