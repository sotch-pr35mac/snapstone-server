/*
 * @author      ::  Preston Wang-Stosur-Bassett <preston.wang-stosur-bassett14@kzoo.edu>
 * @date        ::  Nov 15, 2017
 * @description ::  This file provides the logic for building the search table and actually searching said table
*/

var Hashtable = require('hashtable');
var getJSON = require('load-json-file');
var pinyin = require('prettify-pinyin');
var path = require('path');

class Dictionary {
    constructor() {
        this.simplifiedTable = new Hashtable();
        this.traditionalTable = new Hashtable();

        console.log('Starting to read dictionary file....');
        getJSON(path.join(__dirname, 'cc-cedict.json')).then(wordList => {
            console.log('Loading...');

            for(var i = 0; i < wordList.length; i++) {
                // Separate definitions from "word object" into an array
                if(wordList[i].definitions) {
                    wordList[i].definitions = wordList[i].definitions.split("; ");
                }

                if(wordList[i].pronunciation) {
                    wordList[i].pronunciation = pinyin.prettify(wordList[i].pronunciation.substring(1, wordList[i].pronunciation.length - 1));
                }

                var word = {
                    simplified: wordList[i].simplified,
                    traditional: wordList[i].traditional,
                    pinyin: wordList[i].pronunciation,
                    definitions: wordList[i].definitions
                };

                if(this.traditionalTable.has(word.traditional)) {
                    var addWord = this.traditionalTable.get(word.traditional);
                    addWord.push(word);
                    this.traditionalTable.put(word.traditional, addWord);
                } else {
                    var addWord = [];
                    addWord.push(word);
                    this.traditionalTable.put(word.traditional, addWord);
                }

                if(this.simplifiedTable.has(word.simplified)) {
                    var addWord = this.simplifiedTable.get(word.simplified);
                    addWord.push(word);
                    this.simplifiedTable.put(word.simplified, addWord);
                } else {
                    var addWord = [];
                    addWord.push(word);
                    this.simplifiedTable.put(word.simplified, addWord);
                }
            }

            console.log("Finished loading dictionary");
        });
    }

    search(script, text, cb) {
        var self = this;
       function searchTraditional(traditionalText, callback) {
        // Put all the compund words into this array so they can be searched as compound words
        var compounds = [];
        var infiniteLoopCheck = 0;

        while(traditionalText.length > 0 && infiniteLoopCheck < 8000) {
            if(traditionalText.length >= 4 && self.traditionalTable.has(traditionalText.substring(0, 4))) {
                var compoundWord = self.traditionalTable.get(traditionalText.substring(0, 4));
                compounds.push(compoundWord);
                traditionalText = traditionalText.substring(4);
            } else if(traditionalText.length >= 3 && self.traditionalTable.has(traditionalText.substring(0, 3))) {
                var compoundWord = self.traditionalTable.get(traditionalText.substring(0, 3));
                compounds.push(compoundWord);
                traditionalText = traditionalText.substring(3);
            } else if(traditionalText.length >= 2 && self.traditionalTable.has(traditionalText.substring(0, 2))) {
                var compoundWord = self.traditionalTable.get(traditionalText.substring(0, 2));
                compounds.push(compoundWord);
                traditionalText = traditionalText.substring(2);
            } else if(traditionalText.length >= 1 && self.traditionalTable.has(traditionalText.substring(0, 1))) {
                var compoundWord = self.traditionalTable.get(traditionalText.substring(0, 1));
                compounds.push(compoundWord);
                traditionalText = traditionalText.substring(1);
            } else {
                console.log('The character was not recognized. Skipping...');
                console.log(traditionalText.substring(0, 1));
                traditionalText = traditionalText.substring(1);
            }

            infiniteLoopCheck++;
        }

        callback(compounds);
       }

       function searchSimplified(simplifiedText, callback) {
        var compounds = [];
        var infiniteLoopCheck = 0;

        while(simplifiedText.length > 0 && infiniteLoopCheck < 8000) {
            if(simplifiedText.length >= 4 && self.simplifiedTable.has(simplifiedText.substring(0, 4))) {
                var compoundWord = self.simplifiedTable.get(simplifiedText.substring(0, 4));
                compounds.push(compoundWord);
                simplifiedText = simplifiedText.substring(4);
            } else if(simplifiedText.length >= 3 && self.simplifiedTable.has(simplifiedText.substring(0, 3))) {
                var compoundWord = self.simplifiedTable.get(simplifiedText.substring(0, 3));
                compounds.push(compoundWord);
                simplifiedText = simplifiedText.substring(3);
            } else if(simplifiedText.length >= 2 && self.simplifiedTable.has(simplifiedText.substring(0, 2))) {
                var compoundWord = self.simplifiedTable.get(simplifiedText.substring(0, 2));
                compounds.push(compoundWord);
                simplifiedText = simplifiedText.substring(2);
            } else if(simplifiedText.length >= 1 && self.simplifiedTable.has(simplifiedText.substring(0, 1))) {
                var compoundWord = self.simplifiedTable.get(simplifiedText.substring(0, 1));
                compounds.push(compoundWord);
                simplifiedText = simplifiedText.substring(1);
            } else {
                console.log('The character was not recognized. Skipping...');
                console.log(simplifiedText.substring(0, 1));
                simplifiedText = simplifiedText.substring(1);
            }

            infiniteLoopCheck++;
        }

        callback(compounds);
       }
       
       // Remove all special characters, whitespace, and newline, that would break the search
       text = text.trim();
       text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
       text.replace(' ', '');

       if(script == 'traditional') {
           searchTraditional(text, function(res) {
            cb(res);
           });
       } else {
           searchSimplified(text, function(res) {
            cb(res);
           });
       }
    }

    translate(script, text, callback) {
        var self = this;

        // Call the search method
        self.search(script, text, function(results) {
            console.log("Here are the actual search results: ");
            console.log(results);

            var fullString = "";
            for(var i = 0; i < results.length; i++) {
                fullString += results[i][0].definitions[0] + " ";
            }

            var fullResponse = {
                translation: fullString
            };

            callback(fullResponse);
        });
    }
}

// Add the class to module.exports so it can be accessed elsewhere as a library
module.exports = Dictionary;