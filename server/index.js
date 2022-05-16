const express = require("express"); // Adding Express
var timeout = require("connect-timeout");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { GoogleSpreadsheet } = require("google-spreadsheet");
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
  const doc = new GoogleSpreadsheet(
    "1C6R4M-3J3awSZZiN1DwXFTmAfPo-Gcr5o-QaSygCdXg"
  );
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const worksheet = doc.sheetsByIndex[0]; // Here, 1st tab on Google Spreadsheet is used.

  // This is from your sample value.
  const values = [
    { a: "123", b: "456" },
    { a: "321", b: "654" },
  ];
  await worksheet.setHeaderRow(Object.keys(values[0])); // This is the header row.
  await worksheet.addRows(values); // Your value is put to the sheet.
  // // const { request, name } = req.body;

  // const auth = new google.auth.GoogleAuth({
  //   keyFile: "credentials.json",
  //   scopes: "https://www.googleapis.com/auth/spreadsheets",
  // });

  // // Create client instance for auth
  // const client = await auth.getClient();

  // // Instance of Google Sheets API
  // const googleSheets = google.sheets({ version: "v4", auth: client });

  // const spreadsheetId = "1C6R4M-3J3awSZZiN1DwXFTmAfPo-Gcr5o-QaSygCdXg";

  // // Get metadata about spreadsheet
  // const metaData = await googleSheets.spreadsheets.get({
  //   auth,
  //   spreadsheetId,
  // });

  // // Read rows from spreadsheet
  // // const getRows = await googleSheets.spreadsheets.values.get({
  // //   auth,
  // //   spreadsheetId,
  // //   range: "Sheet1!A:A",
  // // });

  // // Create new speadsheet
  // const title = "test";
  // const requestBody = {
  //   properties: {
  //     title,
  //   },
  // };
  // googleSheets.spreadsheets.create(
  //   {
  //     requestBody,
  //     fields: "spreadsheetId",
  //   },
  //   (err, spreadsheet) => {
  //     if (err) {
  //       // Handle error.
  //       console.log(err);
  //     } else {
  //       console.log(`Spreadsheet ID: ${spreadsheet.spreadsheetId}`);
  //     }
  //   }
  // );

  // let result = [
  //   { name: "vinh", school: "hnue" },
  //   { name: "nam", school: "ltv" },
  // ];

  // // Write row(s) to spreadsheet
  // await googleSheets.spreadsheets.values.append({
  //   auth,
  //   spreadsheetId,
  //   range: "Sheet1",
  //   valueInputOption: "USER_ENTERED",
  //   resource: {
  //     values: [Object.keys(result[0])],
  //   },
  // });
  // for (const res of result) {
  //   await googleSheets.spreadsheets.values.append({
  //     auth,
  //     spreadsheetId,
  //     range: "Sheet1",
  //     valueInputOption: "USER_ENTERED",
  //     resource: {
  //       // values: [{ a: "123", b: "456" }, { a: "321", b: "654" }],
  //       values: [Object.values(res)],
  //     },
  //   });
  // }

  // res.send(metaData);
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
