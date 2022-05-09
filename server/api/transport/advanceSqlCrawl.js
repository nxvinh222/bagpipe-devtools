const { Client } = require("pg");
const sql = require("sql");
var fs = require("fs");
const path = require("path");
const flatten = require("../../utils/flatten");
const advanceCrawlService = require("../service/advanceCrawl");
const { log } = require("console");
const SaveResult = require("../service/saveResult");
const { response } = require("express");
const responseSuccess = require("./response/successResponse");
// console.log(process.env);
async function advanceSqlCrawlTransport(req, res) {
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
    let result = await advanceCrawlService(req.body);
    console.log("Scraping done! Streaming to client!");
    result = flatten(result);
    const fileName = `${Date.now()}`;
    await SaveResult(client, result, fileName);
    responseSuccess(res, `${fileName}.sql`);
  } catch (error) {
    console.log("Scrape failed: ", error);
    res.status(500).send({
      msg: "Scrape failed, please try again!",
      error: error,
    });
  }
}

module.exports = advanceSqlCrawlTransport;
