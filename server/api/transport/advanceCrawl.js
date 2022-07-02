const flatten = require("../../utils/flatten");
const advanceCrawlService = require("../service/advanceCrawl");
const SaveJsonResult = require("../service/save/saveJsonResult");
const SaveSheet = require("../service/save/saveSheet");
const responseSuccess = require("./response/successResponse");
var httpRequest = require('request');

async function advanceCrawlTransport(req, res) {
  let sheetUrl = req.body.sheet_id;
  let recipeId = req.body.recipe_id;
  try {
    let [result, generatedFileName] = await advanceCrawlService(req.body);
    console.log("[INFO] Scraping done! Saving result!");

    const fileName = `${generatedFileName}.json`;
    await SaveJsonResult(result, fileName);
    try {
      await SaveSheet(sheetUrl, flatten(result));
    } catch (error) {
      console.log("[ERROR] Cannot save to sheet: ", error.message);
    }
    // Update filename
    var updateCrawlerStatusOptions = {
      url: `http://localhost:8080/api/v1/recipes/${recipeId}`,
      method: 'PUT',
      json: {
        result_file: fileName,
      }
    }
    httpRequest(updateCrawlerStatusOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log("[INFO]  Update result filename succeed!")
      } else {
        console.log("[ERROR] Update result filename failed")
      }
    })
    // Response
    responseSuccess(res, `${fileName}`);
  } catch (error) {
    console.log("[ERROR] Scrape failed: ", error);
    // Update status to failed
    var updateCrawlerStatusOptions = {
      url: `http://localhost:8080/api/v1/recipes/${recipeId}`,
      method: 'PUT',
      json: {
        status: 4,
      }
    }
    httpRequest(updateCrawlerStatusOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log("[INFO] Update status succeed!: status failed")
      } else {
        console.log("[ERROR] Update status failed")
      }
      res.status(500).send({ error: "Scrape failed, please try again!" });
    })
  }
}

module.exports = advanceCrawlTransport;
