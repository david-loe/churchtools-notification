const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true},
  email: {type: String},
  loginToken: {type: String},
  rules: [{ name: { type: String }, conditions: [{ field: {type: String}, operator : {type: String, enum: ['=', '!=', '<', '>']}, value:{type: String} }], lastEvaluation: {type: Date} }],
})


module.exports = mongoose.model('User', userSchema)
