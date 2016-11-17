var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var ip = require('ip');
var app = express()
// REDIS
var client = redis.createClient('6379', 'redis');

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	// ... INSERT HERE.
	

	next(); // Passing the request to the next handler in the stack.
});

// app.get
var serverKey = "serverKey";
var serverPairKey = "serverPairKey";
var proxyKey = "proxyKey";
var cacheKey = "cacheKey";
function proxy(req,res){
	client.rpoplpush(proxyKey,cacheKey,function(error,item){
		console.log(item)
		res.redirect(item+req.url);
	});
	client.rpoplpush(cacheKey, proxyKey);
};

app.get('/', function(req, res) {
	res.send("Home page at port 3000");
});

app.get('/clear', function(req, res) {
	client.flushall(function(req,value) {
		res.send('OK');
	});
});

app.get('/clear', function(req, res) {
	client.flushall(function(req,value) {
		res.send('OK');
	});
});

app.get('/get', function(req, res) {
	proxy(req,res)
})

app.get('/set', function(req, res) {
	proxy(req,res)
})

app.get('/recent', function(req, res) {
	proxy(req,res)
})

// HTTP SERVER
var server = app.listen(3000, function () {

	var host = ip.address();
	var port = server.address().port

	console.log('Example app listening at http://%s:%s', host, port)
})
