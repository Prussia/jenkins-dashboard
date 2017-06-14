var express = require("express");
var config  = require("./config.json");
var routes = require('./route/route')
var app     = express();
var publicPath  = config.staticFolder;

var port    = config.port ? config.port : 80;

//the static pages
app.use(express.static(__dirname + publicPath));
app.use("/", routes);

// Initialize the dashboard
app.listen(port);

// Some output to indicate all is working according to plan.
console.log("* Running on port: " + port);

// Catch any uncaught exceptions so we can run indefinately
process.on('uncaughtException', function(err) {
    console.error('Caught exception: ' + err);
});