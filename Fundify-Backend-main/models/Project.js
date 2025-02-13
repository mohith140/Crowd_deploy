const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  pageName: String,
  email: String,
  title: String,
  description: String,
  amount: Number,
  projectURL: String,
  profileImage:String,
  n1:String,
  audience: [],
  category:String
  
});

module.exports = mongoose.model('Project', projectSchema);
