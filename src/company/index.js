var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

const prefix = process.env.PREFIX || '/api/company';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mongo/company_db');

var Company = mongoose.model('Company', {
	name: String,
	description: String,
	address: String,
});


(async () =>{
	const count = await Company.estimatedDocumentCount({});
	if (count <= 0) {
		console.log('Using seed ...')
		const seed = require('./seed');
		for (let i = 0; i < seed.length; i++) {
			const c = new Company(seed[i]);
			await c.save();
		}
		console.log('Using seed ... OK'); 
	}
})()
	
/**
 * Parse parameters in POST
 */
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post(prefix + '/add', async function (req, res, next) {
	const {name, description, address} = req.body;
	const valid = [
		typeof name === "string", name.length <= 255,
		typeof description === "string", description.length <= 500,
		typeof address === "string",
	].every(x => !!x);
	if (!valid) {
		return res.json({status: "NOK", message: "Invalid model"});
	}

	const company = new Company({name, description, address});
	try {
		await company.save()
		return res.json({status: "OK"});
	} catch {
		return res.json({status: "NOK"});
	}

});

app.get(prefix + '/find', async function (req, res, next) {
	const name = req.query.name;
	console.log(name);

	if (!name) {
		return res.json({status: "NOK", message: "Invalid request"});
	}

	try {
		const ret = await Company.findOne({ name }).exec()
		return ret
		? res.json({ name: ret.name, description: ret.description, address: ret.address })
		: res.json(null);
	} catch {
		return res.json({status: "NOK"});
	}

});

app.get(prefix + '/all', async function (req, res, next) {
	return res.json(await Company.find().exec());
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