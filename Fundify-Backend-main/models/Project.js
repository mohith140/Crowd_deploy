const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  pageName: String,
  email: String,
  title: String,
  description: String,
  amount: Number,
  projectURL: String,
  imageUrl:String,
  n1:String,
  audience: [],
});

module.exports = mongoose.model('Project', projectSchema);
