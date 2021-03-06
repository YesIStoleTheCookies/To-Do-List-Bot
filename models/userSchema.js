const mongoose = require('mongoose');
const taskSchema = require('./taskSchema.js').schema;



const userSchema = new mongoose.Schema({
  uid: {type: Number, unique: true},
  tasks: [taskSchema],
  optIn: Boolean,
  lastDate: Date,
  lastList: {type: [String], default: ["", "", ""]},
  lastListDate: {type: Date, default: "09/28/2003"},
  lastListAll: {type: [String], default: ["", "", ""]},
  mobile: {type: Boolean, default: false}
});
const user = mongoose.model('User', userSchema);
module.exports = user;
