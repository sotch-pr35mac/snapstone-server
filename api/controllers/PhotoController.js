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
var dictionary = new Dictionary();

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
            var resultFromPhoto = {
              confidence: result.confidence,
              text: result.text
            };

            console.log(resultFromPhoto);

            fs.unlink(photo);

            // TODO: Upload the script preference from the client side
            // Uncomment the below code to search the dictionary to return the results to the user
            // `scriptSetting` is either "traditional" or "simplified", the search preference, which should be sent up from the client side
            /*dictionary.search(scriptSetting, resultFromPhoto, function(resultToSend) {
              console.log(resultToSend);
              res.send(resultToSend);
            });*/

            // TODO: Remove the below line when the above code is uncommented, so that only one result is sent back to the user
            res.send(resultFromPhoto);
          });
        }
      });
    }
};
