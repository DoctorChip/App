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
var importAll = require('./resources/importAll');
//var importPPM = require('./resources/importPPM');
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

//REGISTER A NEW USER
app.get('/register', function(req, res) {
	register(req, res);
	res.end();
});

//ATTEMPT LOGIN
app.get('/login', function(req, res, next) {
	login(req, res, next);
}, function(req, res) {
	res.send(res.login);
	res.end();
});

//REQUEST LOCAL HIGHSCORE TABLE
app.get('/hiscore-local', function(req, res) {
	hiscoreLocal(escape(req.query.location));
	res.end();
});

//REQUEST GLOBAL HIGHSCORE TABLE
app.get('/hiscore-global', function(req, res) {
	hiscoreGlobal();
	res.end();
});

//REQUEST CURRENT USER INFO
app.get('/user-info', function(req, res) {
	userInfo(req.query.username);
	res.end();
});

//REQUEST CURRENT USER'S SOLVED IMAGES
app.get('/user-images', function(req, res) {
	userImages(req.query.username);
	res.end();
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
	res.end();
});

//RETURN A QUESTION
app.get('/answer', function(req, res, next) {
	answerQuestion(req, res, next);
}, function(req, res) {
	res.send(res.result);
	res.end();
});

//REQUEST THE CURRENT IMAGE
app.get('/img', function(req, res, next) {
	currentImg(req, res, next);
}, function(req, res) {
	var imageDir = __dirname + res.currentImage;
	res.sendFile(imageDir);
	res.end();
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
	importAll(req.query.filename);
	//importPPM(req.query.filename, req.query.location);
	res.end();
});



///////////////////////////////////////////////////
//                 TO DO NOTES                   //
///////////////////////////////////////////////////
// 
// ------ high priority ------
// 
// ------ low priority -------
// -- register user needs reforming into less queries and to better handle error messages
// -- Once android dev begins, look in to editing app.get into app.post
// 
///////////////////////////////////////////////////