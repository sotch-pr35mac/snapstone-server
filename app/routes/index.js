/*
 *  @file         ::  app/routes/index.js
 *  @author       ::  Preston Wang-Stosur-Bassett <preston.wang-stosur-bassett14@kzoo.edu>
 *  @created      ::  Oct 11, 2017
 *  @updated      ::  N/A
 *  @description  ::  Aggregate of all the routes
*/

const routes = require('./router.js');

module.exports = function(app, db) {
  routes(app, db);
};
