/**
 * AuthController
 *
 * @author			:: Preston Wang-Stosur-Bassett <preston.wang-stosur-bassett14@kzoo.edu>
 * @date				:: Oct 16, 2017
 * @description	:: This file handles the server side logic for authentication
 */

// Require Depenedencies
var passport = require('passport');
var Dictionary = require('./Dictionary/Dictionary.js');
var dictionary = new Dictionary();

module.exports = {
  login: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if(err || !user) {
        console.log('user = ' + user);
        console.log('error = ' + err);
        console.log('info: ');
        console.log(info);
        res.send({
          success: false,
          status: 401,
          message: 'There was an error authenticating the user.'
        });
      } else if(!err && user) {
        req.logIn(user, function(err) {
          if(err) {
            console.log('There was an error logging in the user.');
            console.log('Error = ' + err);
            console.log(user);
            res.serverError();
            res.send({
              success: false,
              status: 500,
              message: 'There was an error logging in the user.'
            });
          } else {
            console.log('Login Successful');
            console.log(user);
            res.send({
              user: user,
              success: true,
              status: 200,
              message: 'Login Successful'
            });
          }
        });
      } else {
        console.log('Something happened here...');
        console.log(err);
        console.log(user);
        res.serverError();
        res.send({
          status: 500,
          success: false,
          message: 'There was an unexpected error.'
        });
      }
    })(req, res);
  },

  logout: function(req, res) {
    req.logout();
    res.send({
      success: true,
      status: 200,
      message: 'User successfully logged out.'
    });
  },

  create: function(req, res) {
    var newUser = req.body;

    User.create({
      username: newUser.username,
      password: newUser.password,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    }).exec(function(err, user) {
      if(err || user == undefined) {
        console.log('There was an error creating the new user in the database.');
        console.log('Error = ' + err);
        res.serverError();
        res.send({
          success: false,
          status: 500,
          message: 'There was an error creating the new user in the database.'
        });
      } else {
        console.log('New User Account Created!');
        console.log("Here is the user object for the newly created user:");
        user.password = "Nice try ;-)";
        console.log(user);
        res.send({
          success: true,
          status: 200,
          message: 'New user account successfully created!'
        });
      }
    });
  },

  test: function(req, res) {
    console.log("About to make the search.");
   dictionary.search("traditional", "你好", function(result) {
     console.log("search complete");
    console.log(result);
    console.log(result[0][0].definitions);
   });

   console.log("Performing edge case search: ");
   dictionary.search("traditional", "asdf", function(result) {
    console.log("search complete");
    console.log(result);
   });

   dictionary.search("simplified", "你好. 我是个学生. 我觉得学汉语挺有意思! 但是, 明天我不会上课因为我有别的事.", function(result) {
    console.log("this one is just for fun: ");
    var fullString = "";
    for(var i = 0; i < result.length; i++) {
      fullString += result[i][0].definitions[0];
      fullString += " ";
    }
    console.log(fullString);
   });
  }
};
