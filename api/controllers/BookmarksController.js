/**
 * BookmarksController
 *
 * @author			:: Preston Wang-Stosur-Bassett <preston.Wang-Stosur-Bassett14@kzoo.edu>
 * @date				:: Nov 13, 2017
 * @description	:: This file handles the server side logic for bookmarks handeling
 */

module.exports = {
  add: function(req, res) {
    var post = req.body;

    User.findOne({ id: req.user.id }).exec(function(err, user) {
      if(err || user == undefined) {
        console.log("There was an issue looking up that user on the database.");
        console.log("Error: ");
        console.log(err);
        res.send({
          message: 'There was an error with the user.',
          status: 500,
          error: new Error('There was an error with the user. Error = ' + err)
        });
      }
      else {
        // Add the new word to the user's bookmarks in the database
        var word = {
          traditional: post.traditional,
          simplified: post.simplified,
          pinyin: post.pinyin,
          definitions: post.definitions
        };

        if(user.bookmarks == undefined) {
          user.bookmarks = new Array();
        }

        user.bookmarks.push(word);

        user.save(function(err) {
          if(err) {
            console.log("There was an error when saving the user.");
            console.log("Error: ");
            console.log(err);
            res.send({
              status: 500,
              message: 'There was an unexpected error.',
              error: new Error('There was an unexpected error. Error = ' + err)
            });
          }
          else {
            // Successfully added the word to bookmarks
            res.send({
              status: 200,
              message: 'Word successfully added to bookmarks'
            });
          }
        })
      }
    });
  },

  remove: function(req, res) {
    var post = req.body;

    User.findOne({ id: req.user.id }).exec(function(err, user) {
      if(err || user == undefined) {
        console.log("There was an error getting the user.");
        console.log("Error: ");
        console.log(err);
        res.send({
          status: 500,
          message: 'There was an unexpected error',
          error: new Error('There was an unexpected error. Error = ' + err)
        });
      } else {
        var trad = post.traditional;
        var newArray = new Array();

        for(var i = 0; i < user.bookmarks.length; i++) {
          if(user.bookmarks[i].traditional != trad) {
            newArray.push(user.bookmarks[i]);
            break;
          }
        }

        if(newArray.length != user.bookmarks.length - 1) {
          // There was an error
          res.send({
            status: 500,
            message: 'There was an error removing that bookmark.',
            error: new Error('There was an error removing that bookmarks')
          });
        } else {
          user.bookmarks = newArray;
          user.save(function(err) {
            if(err) {
              console.log("There was an error saving the user."),
              console.log("Error: ");
              console.log(err);
              res.send({
                status: 500,
                message: 'There was an unexpected error.',
                error: new Error('There was an unexpected error. Error = ' + err)
              });
            }
            else {
              res.send({
                status: 200,
                message: 'The word was removed from bookmarks.'
              });
            }
          });
        }
      }
    });
  },

  get: function(req, res) {
    User.findOne({ id: req.user.id }).exec(function(err, user) {
      if(err || user == undefined) {
        console.log("There was an error getting the user.");
        console.log("Error: ");
        console.log(err);
        res.send({
          status: 500,
          message: 'There was an unexpected error',
          error: new Error('There was an unexpected error. Error = ' + err)
        });
      } else {
        if(user.bookmarks == undefined) {
          user.bookmarks = new Array();
        }

        res.send({
          status: 200,
          bookmarks: user.bookmarks
        });
      }
    });
  }
};
