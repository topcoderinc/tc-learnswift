var express = require('express');
var router = express.Router();
var Q = require("q");
var User = require('../models/User');
var Problem = require('../models/Problem');
var fs = require('fs');
var appRoot = require('app-root-path');

var getProblem = function(user) {
  var deferred = Q.defer();
  // choose a random problem and return it
  Problem.count(function(err, ct) {
    var r = Math.floor(Math.random() * ct);
    Problem.find().limit(1).skip(r).exec(function(err, problem) {
      fs.readFile(appRoot.path + '/problems/' + problem[0].file, 'utf8', function (err,data) {
        if (err) { deferred.reject(err); }
        if (!err) { deferred.resolve({file: problem[0].file, instructions: data}); }
      });
    });
  });
  return deferred.promise;
};

/* GET the probelm */
router.get('/', function(req, res) {

  if (typeof req.query.handle === 'undefined' || req.query.handle === '') {
    res.render('nohandle');
  } else {

    var user = new User({
      handle: req.query.handle
    });

    User.findOne({ handle: req.query.handle }, function(err, existingUser) {
      if (existingUser) {
        fs.readFile(appRoot.path + '/problems/' + existingUser.problems[0], 'utf8', function (err, instructions) {
          res.render('index', { instructions: instructions });
        }); 
      } else {

        getProblem(new User())
          .then(function(problem) {
            user.problems.push(problem.file);
            user.save(function(err) {
              res.render('index', { instructions: problem.instructions });
            });
          });
      }
    });

  }

});

module.exports = router;
