const express = require('express'); // Adding Express
var timeout = require('connect-timeout');
const puppeteer = require("puppeteer");
const fs = require('fs');
const scrapeText = require('./utils/scrapeText.js');
const { log } = require('console');

const app = express(); // Initializing Express

app.use(timeout('120s'));
app.use(haltOnTimedout);
app.use(express.json())

// Wrapping the Puppeteer browser logic in a GET request
app.post('/', async function (req, res) {
    try {
        const result = await scrapeText(req.body)
        console.log("Scraping done! Streaming to client!");
        const json = JSON.stringify(result);
        const buf = Buffer.from(json);
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-disposition': 'attachment; filename=data.json'
        });
        res.write(buf);
        res.end();
    } catch (error) {
        console.log("Scrape failed: ", error);
        res.status(500).send({ error: "Scrape failed, please try again!" })
    }

    // res.send(result)
});

// Making Express listen on port 7000
app.listen(7000, function () {
    console.log('Running on port 7000.');
});

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
}