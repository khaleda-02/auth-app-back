const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    console.log("connecting");
    const res = await mongoose.connect(process.env.CONNECTION);
    console.log("connection success!!");
  } catch (err) {
    console.log("connection failed !!", err);
    process.exit(1);
  }
};
module.exports = connectDb;
