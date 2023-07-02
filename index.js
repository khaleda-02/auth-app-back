const express = require('express');
require('dotenv').config();
const connectDb = require('./config/dbConnection');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const app = express();
const port = 3001 || process.env.PORT;

connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

//? req logger 
function loggerMiddleware(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}
app.use(loggerMiddleware);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.use(errorHandler);


// Register the middleware for all routes
app.use(loggerMiddleware);

app.listen(port, () => {
  console.log('test', port);
});
