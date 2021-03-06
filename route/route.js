var express = require('express');
var router = express.Router();
var request = require("request");
var config  = require("../config.json");
var path = require('path');
var stringify = require("json-stringify-pretty-compact")
var publicPath  = config.staticFolder;

// Render the static HTML file. This file is generated from a jade template
// located in "assets".
router.get('/', function(req, res) {
    //res.sendFile(__dirname + "../public/app.html");
    res.sendFile('app.html', { root: path.join(__dirname, '../'+ publicPath) });
});

// API to get data from jenkis
router.get('/data', function (req, res) {
    
    var query = "depth=1&tree=jobs[displayName,color,builds[number,timestamp,culprits[property[address],fullName]]{,1}]";
    var content = { jobs: [] };

    // Read the body content and wait until all Jenkins requests have been completed.
    var read = function (err, response, body) {
        body = JSON.parse(body);

        for (var key in body.jobs) {
            var job = body.jobs[key];
            job.host = response.request.uri.hostname;
        }

        content.jobs.push.apply(content.jobs, body.jobs);

        // Only send the content once all requests have been read
        
        res.send(JSON.stringify(content));
        
    };

    
    var jenkins = config.host;
    var protocol = jenkins.secure ? 'https' : 'http';

    request(protocol + "://" + jenkins.url + ":" + jenkins.port + "/api/json?" + query, read);
    
});

// API to get data from jenkis
router.get('/data/job/Seed-Back', function (req, res) {
    var jobName = "Seed-Back";
    // if(jobName !== null && jobName !== undefined){
    //     console.log("job Name =" + jobName);
    // }else{
    //     console.log("no job name for job api");
    // }
    
    requestJob(req, res,jobName);
    
});

function requestJob(req, res,jobName){
    var query = "depth=1&tree=displayName,url,color,lastBuild[fullDisplayName,number,url,timestamp,duration,culprits[property[address],fullName],actions[failCount,skipCount,totalCount]]";
    var content = { jobs: [] };

    // Read the body content and wait until all Jenkins requests have been completed.
    var read = function (err, response, body) {
        body = JSON.parse(body);
        
        body.host = response.request.uri.hostname;
            
        var out = stringify(body);
            
        console.warn("send response json = " + out);

        res.send(out);
    };
    
    var jenkins = config.host;
    var protocol = jenkins.secure ? 'https' : 'http';

    request(protocol + "://" + jenkins.url + ":" + jenkins.port + "/job/" + jobName +  "/api/json?" + query, read);
}


module.exports = router;