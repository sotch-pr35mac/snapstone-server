/**
 * PhotoController
 *
 * @author			:: Daniel Michelin <k14dm01@kzoo.edu>
 * @date				:: Oct 16, 2017
 * @description	:: This file handles the server side logic for photo processing
 */
const Tesseract = require('tesseract.js');
var path = require('path');
//var trad = path.resolve(__dirname, 'chi_tra.traineddata');
//var simp = path.resolve(__dirname, 'chi_sim.traineddata');
var fs = require('fs');
var Dictionary = require('./Dictionary/Dictionary.js');
var dictionary = new Dictionary();

module.exports = {
    process: function(req, res) {
      console.log("HERE ARE THE HEADERS");
      console.log(req.headers);
      var langPref = req.headers.lang;

      if(langPref == undefined) {
        console.log("NO LANGUAGE PROVIDED. DEFAULTING TO SIMPLIFIED");
        langPref = "simplified";
      }

      var langPath = path.resolve(__dirname, 'chi_' + langPref.substring(0, 3) + '.traineddata');
      console.log("THIS IS THE FILE WE ARE TRYING TO LOAD: " + langPath);

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
            langPath:  langPath
          }).recognize(photo, 'chi_' + langPref.substring(0, 3)).progress(function(p) {
            console.log('progress', p);
          }).then(function(result) {
            var resultFromPhoto = {
              confidence: result.confidence,
              text: result.text
            };

            console.log(resultFromPhoto);

            fs.unlink(photo);

            dictionary.search(langPref, resultFromPhoto.text, function(resultToSend) {
              console.log(resultToSend);
              res.send(resultToSend);
            });
          });
        }
      });
    }
};
