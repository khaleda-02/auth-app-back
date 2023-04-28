const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDb = require('./config/dbConnection');
const { errorHandler } = require('./middleware/errorMiddleware')
const app = express();
const port = 3001 || process.env.PORT;

connectDb()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded())
app.use('/api/auth', require('./routes/authRoutes'))
app.use(errorHandler)

app.listen(port, () => {
  console.log('test', port);
});
