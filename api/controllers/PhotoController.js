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
//var tesseract = Tesseract.create({ langPath: eng });

var lang = 'chi_sim';

var http = require("http"),
  zlib = require("zlib"),
  fs = require("fs")

var Canvas = require('canvas')
  , Image = Canvas.Image;

var TesseractCore = require('tesseract.js-core')
var Module = TesseractCore({
  //TOTAL_MEMORY: 90e6,
  TesseractProgress: function (percent) {
    console.log("progress:", percent)
  }
});

// load the tesseract language data
load_tessdata(lang, function (data) {
  var buf = fs.readFileSync(path.resolve(__dirname, lang + '.traineddata'));
  Module.FS_createPath("/", "tessdata", true, true)
  Module.FS_createDataFile('tessdata', lang + '.traineddata', buf, true, false);
  //Module.FS_createPath("/", "tessdata", true, true)
  //Module.FS_createDataFile('tessdata', lang + '.traineddata', data, true, false);
  ////run_ocr()
})

function load_image(fileName) {
  var data = fs.readFileSync(fileName)
  var img = new Image();
  img.src = data;
  var canvas = new Canvas(img.width, img.height),
    ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  var data = ctx.getImageData(0, 0, img.width, img.height);
  return data;
}


function load_tessdata(lang, cb) {
  fs.readFile(lang + '.traineddata', function (err, data) {
    if (!err) return cb(new Uint8Array(data));
    http.get('http://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/' + lang + '.traineddata.gz', function (res) {
      var gunzip = zlib.createGunzip();
      res.pipe(gunzip).pipe(fs.createWriteStream(lang + '.traineddata'))
      gunzip.on('end', function () { load_tessdata(lang, cb) })
    })
  });
}

module.exports = {
  process: function (req, res) {
    req.file('photo').upload({
      dirname: '../../assets/uploads'
    }, function onUploadComplete(err, files) {
      console.log(files);
      if (err) {
        console.log(err);
        return res.json(500, err);
      } else if (files.length == 0) {
        console.log("File didn't exist in upload.");
        res.notFound({
          status: 'Unsuccess',
          response: 'File not uploaded'
        });
      } else {
        console.log("It totally worked! File uploaded");
        var photo = files[0].fd;

        function run_ocr(photoFile) {
          var im = load_image(photoFile);
          var width = im.width,
            height = im.height;
          var pic = new Uint8Array(width * height);
          for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
              var b = 4 * (i * width + j),
                luma = (im.data[b] + im.data[b + 1] + im.data[b + 2]) / 3,
                alpha = im.data[b + 3] / 255;
              pic[i * width + j] = luma * alpha + (1 - alpha) * 128;
            }
          }

          console.log('image size', width, 'x', height)

          var picptr = Module.allocate(pic, 'i8', Module.ALLOC_NORMAL);

          console.log("initialize...");
          // initialize C++ API
          var base = new Module.TessBaseAPI()
          base.Init(null, lang)

          console.log("stick the picture in memeory");
          // stick the picture in memory

          base.SetImage(Module.wrapPointer(picptr), width, height, 1, width)
          base.SetRectangle(0, 0, width, height)

          console.log("recognize the text on the image");
          // recognize the text on the image
          var text = base.GetUTF8Text()
          console.log("Text = " + text)

          fs.unlink(photoFile);

          // TODO: Do other stuff like search here
          dictionary.translate('simplified', text, function(resToSend) {
            console.log("Search Results: ");
            console.log(resToSend);
            res.send(resToSend);
          });

          // clean up memory and allocated objects
          base.End();
          Module.destroy(base)
          Module._free(picptr);
        }

        run_ocr(photo);

        /*tesseract.recognize(photo).progress(function(p) {
           console.log('progress', p);
         }).then(function(result) {
           var resultFromPhoto = {
             confidence: result.confidence,
             text: result.text
           };

           console.log(resultFromPhoto);

           fs.unlink(photo);

           dictionary.search(scriptSetting, resultFromPhoto, function(resultToSend) {
             console.log(resultToSend);
             res.send(resultToSend);
           });
         });*/
      }
    });
  }
};
