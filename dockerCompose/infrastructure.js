var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var ip = require('ip');
var app = express()
const exec = require('child_process').exec;

// REDIS
var recentKey = "recent Key";

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);
	next(); // Passing the request to the next handler in the stack.
});

//"/" "/get" "/set" "/recent"
app.get('/', function(req, res) {
	res.send("Home page at port " + appPort);
});

//create and destory servers
var serverNum = 2;
var serverKey = "serverKey";
var serverPairKey = "serverPairKey";
var proxyKey = "proxyKey";
app.get("/spawn", function(req, res) {
	var cmd = 'docker-compose scale node='+serverNum;
	exec(cmd, function(error, stdout, stderr) {
		if (error) {
			console.error('exec error:' + error);
			return;
		}
		console.log('stdout:' + stdout);
		console.log('stderr: '+ stderr);
	});
	serverNum++;
});

app.get("/listservers", function(req, res) {
	client.hgetall(serverPairKey, function(err, object) {
		console.log(object);
		res.send(object);
	});
});


// HTTP SERVER
var serverNumKey = "serverNumKey";
var appPort = 3000;
var server = app.listen(appPort, function () {
	// client.lpush([serverKey, ])
	
	var host = ip.address();
	var port = server.address().port;
	console.log(host);

	console.log('Example app listening at http://%s:%s', host, port);
});

