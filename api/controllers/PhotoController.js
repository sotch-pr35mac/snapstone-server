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

module.exports = {
  process: function(req, res) {
  console.log('it works!');
  req.file('photo').upload(function(err, uploadedFiles){
      if(uploadedFiles.length < 1) {

      } else {
        console.log(uploadedFiles);
        var photo = uploadedFiles[0].fd;
        Tesseract.create({langPath:eng}).recognize(photo)
          .progress(function  (p) { console.log('progress', p)})
          .then(function (result) {
            var resultToSendToUser = {confidence: result.confidence,text: result.text};
            console.log(resultToSendToUser);
            res.send(resultToSendToUser);
          });
      }
    });
  }
};
