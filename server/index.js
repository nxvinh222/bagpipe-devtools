const express = require("express"); // Adding Express
var timeout = require("connect-timeout");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const simpleCrawlTransport = require("./api/transport/simpleCrawl.js");
const advanceCrawlTransport = require("./api/transport/advanceCrawl.js");
const advanceSqlCrawlTransport = require("./api/transport/advanceSqlCrawl.js");

process.setMaxListeners(Infinity);

const app = express(); // Initializing Express

// app.use(timeout("1200s"));
// app.use(haltOnTimedout);
app.use(express.json());

// Wrapping the Puppeteer browser logic in a GET request
app.post("/simple", simpleCrawlTransport);
app.post("/advance", advanceCrawlTransport);
app.post("/advance-sql", advanceSqlCrawlTransport);
app.get('/download', function (req, res) {
  const file = path.resolve(__dirname, `./result/test.txt`);
  res.download(file); // Set disposition and send it.
});

// Making Express listen on port 7000
app.listen(7000, function () {
  console.log("Running on port 7000.");
});

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}
