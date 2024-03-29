const express = require('express');
require('dotenv').config();
const connectDb = require('./config/dbConnection');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const { loggerMiddleware } = require('./util');
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
app.use(loggerMiddleware);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.use(errorHandler);

app.listen(port, () => {
  console.log('test', port);
});
