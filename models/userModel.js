const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      // that's convert the capital chars to small
      // lowercase : true ,
      // maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      //! password isn't required , cuz the google users don't have password
      // required: true
    },
    OTP: {
      type: String,
      default: undefined
    },
    OTPCodeExpiration: {
      type: Date,
      default: undefined
    },
    role: {
      user: {
        type: Number,
        default: 218
      },
      admin: Number,
      editor: Number
    }
  },
  {
    timestamps: true
  }
)

{/**
to add a ref (forgin key in relations ) i.e we need to add a x model,
in above code : 
  x:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'x'(model name)
  }
*/}

module.exports = mongoose.model('User', userSchema)
//mongoose will take the User => users collection. 