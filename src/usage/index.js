var express = require('express');
var amqp = require('amqplib');
var bodyParser = require('body-parser');
var app = express();

var queue = 'usage';
const DB = {};

async function wait(n) { return new Promise(r => setTimeout(r, n)); }

async function retryConnec(max) {
	console.log('[RabbitMQ] Retry connect (' + max + ') ... ');
	try {
		return await amqp.connect('amqp://rabbitmq');
	} catch (e) {
		if (max == 0) throw (e);
		await wait(5000);
		return await retryConnec(max-1);
	}
}

(async function () {
	var conn = await retryConnec(10);
	console.log('[RabbitMQ] Connected!');
	var channel = await conn.createChannel();
	var queueInfo = channel.assertQueue(queue, { durable: true });
	channel.consume(queue, function(message) {
		if (message !== null) {
			console.log('[QUE::msg] ' + message.content.toString());
			console.log(message);
			channel.ack(message);
		}
	})
})();


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