/**
 * AuthController
 *
 * @author			:: Preston Wang-Stosur-Bassett <preston.wang-stosur-bassett14@kzoo.edu>
 * @date				:: Oct 16, 2017
 * @description	:: This file handles the server side logic for authentication
 */

module.exports = {
  create: function(req, res) {
    console.log('Here is what is coming in from the POST request: ' + req.body);
    res.send();
  },

  test: function(req, res) {
    console.log('it works!');
    res.send({'message': 'it works!'});
  }
};
