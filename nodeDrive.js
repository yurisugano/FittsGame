"use strict";

const { parse } = require('querystring');

//ForeRunnerDB
let saveToDB = true;
let dbname = "FittsLaw";
let mouseCollectionName = "MousePositions";
let trialCollectionName = "Trials";
var db = null;
var mouseCollection = null;
var trialCollection = null;


// HTTP Portion
var http = require('http');
// Path module
var path = require('path');

// Using the filesystem module
var fs = require('fs');

var server = http.createServer(handleRequest);
server.listen(8080);
startDB();
console.log('Server started on port 8080');




function startDB() {
    var ForerunnerDB = require("forerunnerdb");
    var fdb = new ForerunnerDB();
    db = fdb.db(dbname);
    if(db !== null) {
        db.persist.dataDir("./configData");

        mouseCollection = db.collection(mouseCollectionName, {primaryKey: "TrialDate"});
        trialCollection = db.collection(trialCollectionName, {primaryKey: "TrialDate"});

        loadInformation();
        console.log('DB started and Loaded');
    } else {
        throw "Could Not Create a DB";
    }
}



function storeMouse(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let jsObj = JSON.parse(body);
            console.log(jsObj);
            mouseCollection.insert(jsObj);
            res.end('ok');
        });
    }
}


function storeTrial(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let jsObj = JSON.parse(body);
            console.log(jsObj);
            trialCollection.insert(jsObj);
            res.end('ok');
        });
    }
}


function getTrialData(req, res) {
    console.log(trialCollection.find());
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    // Send data
    res.end(JSON.stringify(trialCollection.find()));
}

function getMouseData(req, res) {
    console.log(mouseCollection.find());
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    // Send data
    res.end(JSON.stringify(mouseCollection.find()));
    console.log(mouseCollection.find());
    res.end('ok');
}




function saveTrialInformation(req, res) {
    trialCollection.save(function (err) {
        if (!err) {
            console.log("Trial Information Saved Successfully");
        }
    });
    mouseCollection.save(function (err) {
        if (!err) {
            console.log("Mouse Information Saved Successfully");
        }
    });
}

function loadInformation() {
    trialCollection.load(function (err) {
        if (!err) {
            console.log("Trial Load Successful");
        }
    });
    mouseCollection.load(function (err) {
        if (!err) {
            console.log("Mouse Load Successful");
        }
    });
}




function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;

   console.log("Requested: " + pathname)

    if(pathname === '/registerMouse/') {
        storeMouse(req, res)
        return;
    }

    if(pathname === '/registerTrial/') {
        storeTrial(req, res)
        return;
    }

    if(pathname === '/saveAllTrialData/') {
        saveTrialInformation(req, res)
        return;
    }

    if(pathname === '/getAllTrialInformation/') {
        getTrialData(req, res)
        return;
    }

    if(pathname === '/getAllMouseInformation/') {
        getMouseData(req, res)
        return;
    }


  // If blank let's ask for index.html
  if (pathname === '/') {
    pathname = '/home.html';
  }


  console.log("Converted: " + pathname)

  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };
  // What is it?  Default to plain text

  var contentType = typeExt[ext] || 'text/plain';

  console.log("Reading: " + __dirname + pathname)


  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}
