const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    console.log('conecting')
    const res = await mongoose.connect(process.env.CONNECTION);
    console.log('connection successs !!')
  } catch (err) {
    console.log('connection failed !!' ,err )
    process.exit(1)
  }
}
module.exports = connectDb;