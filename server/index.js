const express = require('express'); // Adding Express
var timeout = require('connect-timeout');
const puppeteer = require("puppeteer");
const fs = require('fs');

const simpleCrawlTransport = require('./api/transport/simpleCrawl.js');
const advanceCrawlTransport = require('./api/transport/advanceCrawl.js');

const app = express(); // Initializing Express

app.use(timeout('120s'));
app.use(haltOnTimedout);
app.use(express.json())

// Wrapping the Puppeteer browser logic in a GET request
app.post('/simple', simpleCrawlTransport);
app.post('/advance', advanceCrawlTransport);

// Making Express listen on port 7000
app.listen(7000, function () {
    console.log('Running on port 7000.');
});

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
}