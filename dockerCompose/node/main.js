var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var ip = require('ip');
var app = express()
var spawn = require('child_process').spawn;

// REDIS
var recentKey = "recent Key";
var client = redis.createClient(6379, 'redis')

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	client.lpush(recentKey, req.url, function(err, res) {
		console.log("response: " + res);
	});
	client.ltrim(recentKey, 0, 4);
	next(); // Passing the request to the next handler in the stack.
});



//"/" "/get" "/set" "/recent"
app.get('/', function(req, res) {
	res.send("Home page at port " + appPort);
});

app.get('/clear', function(req, res) {
	client.flushall(function(req,value) {
		res.send('OK');
	});
});

app.get('/set', function(req, res) {
	{
		var key = "testKey";
		var msg = "this message will self-destruct in 10 seconds.";
		client.set(key, msg);
		client.expire(key, 10);
		res.send('ok');
	}
});

app.get('/get', function(req, res) {
	{
		var key = "testKey";
		client.get(key, function(err, value){
			res.send(value);
		});
	}
});


app.get("/recent", function(req, res) {
	var key = recentKey;
	client.lrange(key, 0, 4, function(err, value) {
		var resStr = "";
		for (var v in value) {
			resStr += value[v] + "<br/>";
		}
		res.send(resStr);
	});
});


// HTTP SERVER
var proxyKey = "proxyKey";
var appPort = process.argv.slice(2)[0];
var server = app.listen(appPort, function () {
	
  	var host = ip.address();
	var port = server.address().port;
	var url = "http://" + host + ":" + port;
	console.log(url);
	client.lpush(proxyKey, url);

	console.log('Example app listening at http://%s:%s', host, port);
});

