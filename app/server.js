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
const router = express.Router();
const port = 8000;

app.listen(port, () => {
  console.log('Now serving on port ' + port);
});

app.use(router);

router.use(function(req, res, next) {
  next();
});

router.get('/', function(req, res) {
 res.send('you are viewing the homepage.');
});
