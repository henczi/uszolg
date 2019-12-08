var express = require('express');
var bodyParser = require('body-parser');
var app = express();

/**
 * Parse parameters in POST
 */
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: true
}));

//status
app.post('/send', function (req, res, next) {
	console.log(req.body);
});

//status
app.use(function (req, res, next) {
	res.json({status: "OK-NOK"});
});

//500 - error
app.use(function (err, req, res, next) {
	res.status(500).json({error:{code:500, msg:"Something broke!"}});
});

app.listen(80, function () {
	console.log("App listening on port 80!");
});