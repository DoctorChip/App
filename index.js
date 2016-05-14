///////////////////////////////////////////////////
//         SETUP OF RESOURCES AND SERVER         //
///////////////////////////////////////////////////
var express = require('express');
var mysql = require('mysql');
var question = require('./resources/question');
var checkQuestionExists = require('./resources/checkQuestionExists');
var answerQuestion = require('./resources/answerQuestion');
var storeUserQuestion = require('./resources/storeUserQuestion');
var currentImg = require('./resources/currentImg');
var importPPM = require('./resources/importPPM');
var genGIF = require('./resources/genGIF');
var initDatabase = require('./resources/initDatabase');
var makeppm = require('./resources/makePPM');
var register = require('./resources/registerUser');
var login = require('./resources/loginUser');
var hiscoreLocal = require('./resources/hiscoreLocal');
var hiscoreGlobal = require('./resources/hiscoreGlobal');
var userInfo = require('./resources/userInfo');
var userImages = require('./resources/userImages');
var path = require('path');
var serverVersion = require('./resources/serverVersion');
var app = express();

//KEEP THE APP LISTENING FOR NEW REQUESTS
app.set('port', process.env.port || 3000);
app.listen(app.get('port'), function() {
	console.log('Server version >> ' + serverVersion() + " << running.");
});

///////////////////////////////////////////////////
//         SETUP OF USER AVAIL ROUTES            //
///////////////////////////////////////////////////

//REGISTER A NEW USER (change this to POST after we've set up the app to send POST reqs)
app.get('/register', function(req, res) {
	register(req.query);
});

//ATTEMPT LOGIN
app.get('/login', function(req, res) {
	login(req.query);
});

//REQUEST LOCAL HIGHSCORE TABLE
app.get('/hiscore-local', function(req, res) {
	hiscoreLocal(escape(req.query.location));
});

//REQUEST GLOBAL HIGHSCORE TABLE
app.get('/hiscore-global', function(req, res) {
	hiscoreGlobal();
});

//REQUEST CURRENT USER INFO
app.get('/user-info', function(req, res) {
	userInfo(req.query.username);
});

//REQUEST CURRENT USER'S SOLVED IMAGES
app.get('/user-images', function(req, res) {
	userImages(req.query.username);
});

//REQUEST A NEW QUESTION
app.get('/new', function(req, res, next) {
	checkQuestionExists(req, res, next, function() {
		question.gen(req, res, next);
	});
}, function(req, res, next) {
    storeUserQuestion(req, res, next);
}, function(req, res) {
	res.send(res.question + "... It's " + res.answer + "!");
});

//RETURN A QUESTION
app.get('/answer', function(req, res, next) {
	answerQuestion(req, res, next);
}, function(req, res) {
	res.send(res.result);
	res.end();
});

//REQUEST THE CURRENT IMAGE -- NEEDS CHANGING TO 'USERVAL' NOT 'ACTUALVAL' TO GEN INCOMPLETE IMAGE, NOT COMPLETE
app.get('/img', function(req, res, next) {
	currentImg(req, res, next);
}, function(req, res) {
	var imageDir = __dirname + res.currentImage;
	res.sendFile(imageDir);
});

///////////////////////////////////////////////////
//         SETUP OF ADMIN AVAIL ROUTES           //
///////////////////////////////////////////////////

//INITIALISE ALL TABLES IN OUR DATABASE
app.get('/initDatabase', function(req, res){
	res.send(initDatabase());
	res.end();
});

//IMPORT A NEW .PPM IMAGE TO OUR DATABASE
app.get('/import', function(req, res){
	importPPM(req.query.filename, req.query.location);
	res.end();
});



///////////////////////////////////////////////////
//                 TO DO NOTES                   //
///////////////////////////////////////////////////
// 
// 
// -- automate adding new image once one is solved
// -- COMPLETE LOGIN SCRIPT
// -- check user image function
// 
// 
// 
///////////////////////////////////////////////////





