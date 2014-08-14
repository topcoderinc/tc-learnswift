var mongoose = require('mongoose');

var problemSchema = new mongoose.Schema({
  instructions: String

});

module.exports = mongoose.model('Problem', problemSchema);