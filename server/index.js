const express = require('express'); // Adding Express
var timeout = require('connect-timeout');
const puppeteer = require("puppeteer");
const scrapeText = require('./utils/scrapeText.js')

const app = express(); // Initializing Express

app.use(timeout('30s'));
app.use(haltOnTimedout);
app.use(express.json())

// Wrapping the Puppeteer browser logic in a GET request
app.post('/', async function (req, res) {
    const result = await scrapeText(req.body)
    res.send(result)
});

// Making Express listen on port 7000
app.listen(7000, function () {
    console.log('Running on port 7000.');
});

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
}