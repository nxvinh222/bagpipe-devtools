const express = require("express"); // Adding Express
var timeout = require("connect-timeout");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const creds = require("./credentials.json");
require("dotenv").config();
// console.log(process.env);

const simpleCrawlTransport = require("./api/transport/simpleCrawl.js");
const advanceCrawlTransport = require("./api/transport/advanceCrawl.js");
const advanceSqlCrawlTransport = require("./api/transport/advanceSqlCrawl.js");
const responseSuccess = require("./api/transport/response/successResponse.js");

process.setMaxListeners(Infinity);

const app = express(); // Initializing Express

// app.use(timeout("1200s"));
// app.use(haltOnTimedout);
app.use(express.json());

// Wrapping the Puppeteer browser logic in a GET request
app.post("/simple", simpleCrawlTransport);
app.post("/advance", advanceCrawlTransport);
app.post("/advance-sql", advanceSqlCrawlTransport);
app.get("/download", function (req, res) {
  const file = `./result/${req.query.filename}`;
  res.download(file); // Set disposition and send it.
});
app.get("/test", function (req, res) {
  try {
    exec("pg_dump -U root -d element-svc -t public.hotels > ./my_table.sql");
  } catch (error) {
    console.error("dump failed: ", error.stack);
  }
  responseSuccess(res, null);
});

app.get("/test-sheet", async function (req, res) {
  res.send("Successfully submitted! Thank you!");
});

// Making Express listen on port 7000
app.listen(7000, function () {
  console.log("Running on port 7000.");
});

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

var exec = require("child_process").exec;
function execute(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout);
  });
}
