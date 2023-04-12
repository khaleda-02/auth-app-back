const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    const res = await mongoose.connect('mongodb+srv://khaleda-02:not.khaled.02@khaledcluster.ikeprrd.mongodb.net/contactdb?retryWrites=true&w=majority');
    console.log('connection successs !!')
  } catch (err) {
    console.log('connection failed !!')
    process.exit(1)
  }
}

module.exports = connectDb;