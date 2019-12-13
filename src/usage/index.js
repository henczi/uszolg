var express = require('express');
var amqp = require('amqplib');
var bodyParser = require('body-parser');
var app = express();

const prefix = process.env.PREFIX || '/api/usage';

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
	console.log('[RabbitMQ] Channel created!');

	// TODO: RabbitMQ config
	// Create Que, Exchange, and bind
	var queueInfo = await channel.assertQueue(queue);
	var exchangeInfo = await channel.assertExchange(queue, 'fanout');
	await channel.bindQueue(queue, queue);

	// Subscribe
	var tag = await channel.consume(queue, function(message) {
		if (message !== null) {
			var msgData = JSON.parse(message.content.toString());
			var usageStatusEvent = msgData.message;
			console.log('[QUE::msg] ', usageStatusEvent);
			DB[usageStatusEvent.key] = usageStatusEvent.active || false; // process event
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


app.get(prefix + '/state', function (req, res, next) {
	const keys = req.query.keys && req.query.keys.split(',') || undefined;
	if (keys) {
		const ret = {};
		keys.forEach(x => ret[x] = DB[x]);
		return res.json(ret);
	}
	return res.json({status: "NOK"});
});

//status
app.use(function (req, res, next) {
	res.json({status: "OK"});
});

//500 - error
app.use(function (err, req, res, next) {
	res.status(500).json({error:{code:500, msg:"Something broke!"}});
});

app.listen(80, function () {
	console.log("App listening on port 80!");
});