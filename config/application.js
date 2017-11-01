/**
 *  @author       ::  Preston Wang-Stosur-Basssett <preston.wang-stosur-bassett14@kzoo.edu>
 *  @date         ::  Oct 17, 2017
 *  @description  ::  This file handles application settings and logic for sessions and passport
*/

// Require Depenedencies
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

// Lookup the user in the database by username and verify it's existence
function findByUsername(username, fn) {
  User.findOne({
    username: username
  }).exec(function(err, user) {
    if(err || user == undefined) {
      console.log('There was an error looking up the user with the username ' + username);
      console.log('Error = ' + err);
      return fn(new Error('No user found with username ' + username), null);
    } else {
      return fn(null, user);
    }
  });
}

// Passport session setup
// To support persisent login sessions, passport needs to be able to serialize
// and deserialize users into and outof the session. Typically, this will be as
// simple as storing the user ID when serializing, and finding the user by ID
// when deserializing

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({
    id: id
  }).exec(function(err, user) {
    if(err || user == undefined) {
      console.log('There was an error looking up the user with the id ' + id);
      console.log('Error = ' + err);
      return done(new Error('The user with the id ' + id + ' was not found in the database.'), null);
    } else {
      return done(null, user);
    }
  });
});

// Use the Local Strategy within Passport
// Strategies in passport require a verify function, which accepts crednetials
// in this case a username and password, and invoke a callback with a user object
passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    // Find the user by username. If there is no user with the given username
    // or the password is not correct, sett the user to false to indicate failure
    // and send some sort of flash message or newer quivalent
    // Otherwise, return an authenticated user.
    findByUsername(username, function(err, user) {
      if(err) {
        return done(err);
      } else if(!user) {
        return done(new Error('USER NOT FOUND'), null, {
          message: 'Unknown User: ' + username
        });
      } else {
        bcrypt.compare(password, user.password, function(err, res) {
          if(res != true) {
            console.log('Error = ' + err);
            return done(new Error('INVALID PASSWORD'), null, {
              message: 'Invalid Password'
            });
          } else {
            return done(null, user);
          }
        });
      }
    });
  });
}));
