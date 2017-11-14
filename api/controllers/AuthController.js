/**
 * AuthController
 *
 * @author			:: Preston Wang-Stosur-Bassett <preston.wang-stosur-bassett14@kzoo.edu>
 * @date				:: Oct 16, 2017
 * @description	:: This file handles the server side logic for authentication
 */

// Require Depenedencies
var passport = require('passport');

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
    User.find().exec(function(err, users) {
      if(err) {
        console.log("There was an error.");
        console.log(err);
      } else {
        console.log(users);
      }
    });
  }
};
