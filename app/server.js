/*
 *  @file         ::  server.js
 *  @author       ::  Preston Wang-Stosur-Bassett <preston.wang-stosur-bassett14@kzoo.edu>
 *  @created      ::  Oct 11, 2017
 *  @updated      ::  N/A
 *  @description  ::  This is the main server file
*/

const express = require('express');
//const MongoClient = require('mongodb').MongoClient;
//const bodyParser = require('body-parser');
const app = express();
const port = 8000;

require('./routes/')(app, {});
app.listen(port, () => {
  console.log('Now serving on port ' + port);
});
