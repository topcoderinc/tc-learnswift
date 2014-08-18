var mongoose = require('mongoose');

var problemSchema = new mongoose.Schema({
  file: String

});

module.exports = mongoose.model('Problem', problemSchema);