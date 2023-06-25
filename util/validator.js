const joi = require('joi');
//! befor 

// const registerSchema = joi.object({
// })

// export regiterShema
// in controller : 
//const { error, value } = registerSchema.validate('body')

//! after using advace way :- 
const validator = (schema) =>
  (payload) =>
    schema.validate(payload, { abortEarly: false })

const registerSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(12).alphanum().required(),
})

const passwordSchema = joi.object({
  newPassword: joi.string().min(6).max(12).alphanum().required(),
})

const registerValidator = validator(registerSchema);
//registerValidator is fun that take the payload then it apply validate fun .
const passwordValidator = validator(passwordSchema);

module.exports = { registerValidator, passwordValidator };