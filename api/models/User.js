/**
 * User.js
 *
 * @author      :: Preston Wang-Stosur-Bassett <preston.wang-stosur-bassett14@kzoo.edu>
 * @date        :: Oct 16, 2017
 * @description :: This file is the model that describes database entries
 */

 var bcrypt = require('bcrypt-nodejs');

module.exports = {

  attributes: {
    username: {
      type: 'string',
      unique: true
    },

    password: {
      type: 'string'
    },

    firstName: {
      type: 'string'
    },

    lastName: {
      type: 'string'
    },

    bookmarks: {
      type: 'array',
      defaultsTo: []
      /*
       * The array will be an array of objects in the following format:
        {
          traditional: String,
          simplified: String,
          pinyin: String.
          definitions: ['', '', ''] --> An array of Strings
        }
      */
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  // Encrypt the password before it is saved on the database
  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function() {}, function(err, hash) {
        if(err) {
          console.log(err);
        } else {
          user.password = hash;
          cb(null, user);
        }
      });
    });
  }
};
