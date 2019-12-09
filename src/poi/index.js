var express = require('express');
var bodyParser = require('body-parser');
var redis = require("redis"), client = redis.createClient({ host: 'redis' });
var app = express();

const prefix = process.env.PREFIX || '/api/poi';

/**
 * Redis
 */
client.on("error", (err) => console.log("[REDIS :: Error] " + err))
client.ZRANGE('POI', '0', '1', (err, reply) => {
	if (reply.length == 0) {
		console.log('Using seed data...');
		const args = require('./seed')
		.map(x => {
			return [x.lon, x.lat, JSON.stringify(x)]
		})
		.reduce((acc, x) => acc.concat(x), []);
		client.GEOADD("POI", ...args, (err, reply) => console.log('Using seed data... OK'));
	}
});

/**
 * Parse parameters in POST
 */
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post(prefix + '/add', function (req, res, next) {
	const model = req.body;
	const valid = [
		typeof model.lon === "number",
		typeof model.lat === "number",
		typeof model.name === "string", model.name.length <= 255,
		typeof model.company === "string", model.company.length <= 255,
		typeof model.stations === "number",
		typeof model.kilowatts === "string",
		typeof model.connector === "string",
	].every(x => !!x);
	if (!valid) {
		return res.json({status: "NOK", message: "Invalid model"});
	}

	client.GEOADD("POI", model.lon, model.lat, JSON.stringify(model), (err, reply) => {
		return err 
		? res.json({status: "NOK", message: "Error"})
		: res.json({status: "OK", message: "Added"});
	});
});

app.get(prefix + '/nearby', function (req, res, next) {
	const model = {
		lon: +req.query.lon,
		lat: +req.query.lat,
		dist: +req.query.dist
	};
	const valid = typeof model.lon === "number" && typeof model.lat === "number" && typeof model.dist === "number";
	if (!valid) {
		return res.json({status: "NOK", message: "Invalid request"});
	}
	client.GEORADIUS("POI", model.lon, model.lat, model.dist, 'km', (err, reply) => {
		return res.json(reply.map(x =>JSON.parse(x)));
	});
});

app.get(prefix + '/all', function (req, res, next) {
	client.ZRANGE("POI", 0, -1, (err, reply) => {
		return res.json(reply.map(x =>JSON.parse(x)));
	});
});

app.get(prefix + '/del', function (req, res, next) {
	client.DEL("POI", 0, -1, (err, reply) => {
		return err 
		? res.json({status: "NOK"})
		: res.json({status: "OK"});
	});
});

//status
app.use(function (req, res, next) {
	console.log(req.url)
	res.json({status: "NOK"});
});

//500 - error
app.use(function (err, req, res, next) {
	res.status(500).json({error:{code:500, msg:"Something broke!"}});
});

app.listen(80, function () {
	console.log("App listening on port 80!");
});