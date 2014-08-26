var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('lodash');

/* GET home page. */
router.get('/', function (req, res) {

  if (typeof req.query.handle === 'undefined' || req.query.handle === '') {
    res.render('nohandle');
  } else {
    var handle = req.query.handle;
    var msg = '';
    request('http://tc-leaderboard.herokuapp.com/learnswift/' + handle, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        lb_result = JSON.parse(body);
        // if we can't find them in the leaderboard, check the challenge for their status
        if (lb_result.score === null) {

          request('http://api.topcoder.com/v2/develop/challenges/30045145', function (error, response, body) {
            challenge_result = JSON.parse(body);
            reg_result = _.find(challenge_result.registrants, { 'handle': handle });
            
            if (reg_result === undefined) {
              msg = "Could not find " + lb_result.handle + " as a registrant for this challenge.";
            } else {
              if (reg_result.submissionDate === '') {
                msg = lb_result.handle + " is registered for the challenge but has not submitted yet.";
              } else {
                msg = "Sorry... no results yet for " + lb_result.handle + ". We have received the submission but it has not be reviewed yet. We review submissions on Monday, Wednesday and Friday.";
              }
            }
            res.render('results', { msg: msg});
          });
        } else {
          if (lb_result.score === 1) {
            res.render('results', { msg: "Topcoder.com results for " + handle + "<br/><br/><img src='http://i.imgur.com/1S1Mvr2.jpg' width='200'>" });
          } else {
            res.render('results', { msg: "There was a problem evaluating your submission. Please contact jeff@appirio.com and include your handle." });
          }
        }
      }
    });

  }

});

module.exports = router;