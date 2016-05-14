var client = require('./dbHelper');
var convert = require('./genGIF');
var exportPPM = require('./makePPM');
var fs = require('fs');

module.exports = function(req, res, next) {
        queryDatabase(req, res, next, handleResult);
}


function queryDatabase(req, res, next, callback) {    
        //Query our database to find how many images we've worked through
        client.query("SHOW TABLES FROM " + req.query.location, function(err, result) {
                if (err) {
                        callback(err);
                }

                else {                   
                        //Calculate the length of our table and then the last image in the table
                        var currentImage = result.length - 2;
                        callback(null, req, res, next, currentImage);
                }
        });
}

function handleResult(err, req, res, next, currentImage, callback) {
        //Check for the .GIF of our image
        fs.stat("./img/" + req.query.location + currentImage + ".gif", function(err, stat) {
                if (err==null) {
                        //If we find our .GIF image, send that.
                        var imageFile = "/img/" + req.query.location + currentImage + ".gif";
                        returnValue(null, req, res, next, imageFile);
                }
                else {
                        //Check if we have a .PPM file made for the image instead, then generate a .GIF
                        fs.stat("./img/" + req.query.location + currentImage + ".ppm", function(err, stat) {
                                if (err==null) {
                                        generateGIF(null, req, res, next, currentImage);
                                }

                                else {
                                        //Generate the .GIF if no .GIF or .PPM already.
                                        generatePPM(null, req, res, next, currentImage);
                                }
                        });
                }
        });
}

function generateGIF(err, req, res, next, currentImage, callback) {
        convert.convert(req.query.location + currentImage, function() {
                        var imageFile = "/img/" + req.query.location + currentImage + ".gif";
                        returnValue(null, req, res, next, imageFile);
        });
}

function generatePPM(err, req, res, next, currentImage, callback) {
        exportPPM.make(req.query.location, function() {
                convert.convert(req.query.location + currentImage, function() {
                        var imageFile = "/img/" + req.query.location + currentImage + ".gif";
                        returnValue(null, req, res, next, imageFile);
                });
        });
}

function returnValue(err, req, res, next, currentImage, callback) {
        res.currentImage = currentImage;
        next();
}
