/**
 * PhotoController
 *
 * @author			:: Daniel Michelin <k14dm01@kzoo.edu>
 * @date				:: Oct 16, 2017
 * @description	:: This file handles the server side logic for photo processing
 */
const Tesseract = require('tesseract.js');
var path = require('path');
var eng = path.resolve(__dirname, 'eng.traineddata');
var fs = require('fs');
var Dictionary = require('./Dictionary/Dictionary.js');
//var dictionary = new Dictionary();

module.exports = {
    process: function(req, res) {
      req.file('photo').upload({
        dirname: '../../assets/uploads'
      }, function onUploadComplete(err, files) {
        console.log(files);
        if(err) {
          console.log(err);
          return res.json(500, err);
        } else if(files.length == 0) {
          console.log("File didn't exist in upload.");
          res.notFound({
            status: 'Unsuccess',
            response: 'File not uploaded'
          });
        } else {
          console.log("It totally worked! File uploaded");
          var photo = files[0].fd;

          Tesseract.create({
            langPath: eng
          }).recognize(photo).progress(function(p) {
            console.log('progress', p);
          }).then(function(result) {
            var resultToSendToUser = {
              confidence: result.confidence,
              text: result.text
            };

            console.log(resultToSendToUser);

            fs.unlink(photo);

            res.send(resultToSendToUser);
          });
        }
      });
    }
};
