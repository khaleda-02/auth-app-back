const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    console.log('conecting')
    const res = await mongoose.connect(process.env.DB_CONNECTION);
    console.log('connection successs !!')
  } catch (err) {
    console.log('connection failed !!')
    process.exit(1)
  }
}
module.exports = connectDb;