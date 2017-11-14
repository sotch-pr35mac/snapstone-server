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

module.exports = {
    process: function(req, res) {
      var outDir = __dirname + '/uploads';

      try {
        var Throttle = require('stream-throttle').Throttle;
        var filename = req.headers['file-name'];

        // This is the actual file that comes up from the upload process
        var out = outDir + filename;

        var total = req.headers['content-length'];
        var current = 0;

        // Pipe the stream through the throttle and then write it to a file
        req.pipe(new Throttle({ rate: 1024 * 2048 })).pipe(fs.createWriteStream(out, { flags: 'w', encoding: null, fd: null, mode: 0666 }));

        req.on('end', function() {
          // TODO: open file
          var photo = fromFile;

          Tesseract.create({
            langPath: eng
          }).recognize(photo).progress(function(p) {
            console.log('progress', p);
          }).then(function(result) {
            var resultToSend = {
              confidence: result.confidence,
              text: result.text
            };

            res.send(resultToSend);
          });
        });
      }
      catch(err) {
        console.log('There was an error uploading the file.');
        console.log(err);

        res.send({
          status: 500,
          message: 'An unexpected error occurred.',
          error: new Error('An unexpected error occurred. Error = ' + err)
        });
      }
    }
};
