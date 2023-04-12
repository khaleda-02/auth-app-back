const express = require('express');
require('dotenv').config();
const connectDb = require('./config/dbConnection');

const app = express();
const PORT = 3001 || process.env.PORT;

connectDb()
app.use(express.json())
app.use('/auth', require('./routes/authRoutes'))

app.listen(PORT, () => {
  console.log('test', PORT);
});
