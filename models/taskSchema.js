const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: String,
  date: Date,
  complete: Boolean,
  id: Number,
  rem: Boolean
});
const todo = mongoose.model('todo', taskSchema);
module.exports = todo;
