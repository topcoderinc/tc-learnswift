var mongoose = require('mongoose');
var ProblemSchema = require('../models/Problem').Schema;

var userSchema = new mongoose.Schema({
  handle: String,
  problems: [ProblemSchema]
});

module.exports = mongoose.model('User', userSchema);
