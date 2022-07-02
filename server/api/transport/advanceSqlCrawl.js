const { Client } = require("pg");
const sql = require("sql");
var fs = require("fs");
const path = require("path");
const flatten = require("../../utils/flatten");
const advanceCrawlService = require("../service/advanceCrawl");
const { log } = require("console");
const SaveResult = require("../service/save/saveResult");
const { response } = require("express");
const responseSuccess = require("./response/successResponse");
const SaveSheet = require("../service/save/saveSheet");
const SaveJsonResult = require("../service/save/saveJsonResult");
var httpRequest = require('request');
const getElementSvcRequestOption = require("../../utils/requestBuilder");
// console.log(process.env);
async function advanceSqlCrawlTransport(req, res) {
  let sheetUrl = req.body.sheet_id;
  let recipeId = req.body.recipe_id;
  // Start timer
  let startTime = Date.now();
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  //   let test = connectDb();
  try {
    await client.connect();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: "Db connect failed",
      error: error,
    });
    return;
  }

  try {
    // Crawl
    let [result, generatedFileName] = await advanceCrawlService(req.body);
    console.log("[INFO] Scraping done! Saving result!");

    try {
      await SaveSheet(sheetUrl, flatten(result));
    } catch (error) {
      console.log("[ERROR] Cannot save to sheet: ", error.message);
    }

    let fileName = `${generatedFileName}`;
    try {
      await SaveResult(client, flatten(result), fileName);
      fileName = `${fileName}.sql`;
    } catch (error) {
      console.log("[ERROR] Cannot save as sql file");
      fileName = `${fileName}.json`;
      await SaveJsonResult(result, fileName);
    }
    // Update filename
    // Get crawl time 
    let now = Date.now()
    let crawlTime = Math.floor((now - startTime) / 1000);
    // Update filename and crawl time in seconds
    var updateCrawlerStatusOptions = getElementSvcRequestOption(recipeId,
      {
        crawl_time: crawlTime,
        result_file: fileName
      }
    );
    httpRequest(updateCrawlerStatusOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log("[INFO] Update result filename and crawl time succeed!")
      } else {
        console.log("[ERROR] Update result filename and crawl time failed")
      }
    })
    // Response
    responseSuccess(res, {
      file_name: `${fileName}`,
      crawl_time: crawlTime
    });
  } catch (error) {
    console.log("[ERROR] Scrape failed: ", error);
    res.status(500).send({
      msg: "Scrape failed, please try again!",
      error: error,
    });
  }
}

module.exports = advanceSqlCrawlTransport;
