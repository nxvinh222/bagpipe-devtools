const flatten = require("../../utils/flatten");
const advanceCrawlService = require("../service/advanceCrawl");
const SaveJsonResult = require("../service/save/saveJsonResult");
const SaveSheet = require("../service/save/saveSheet");
const responseSuccess = require("./response/successResponse");
var httpRequest = require('request');
const getElementSvcRequestOption = require("../../utils/requestBuilder");

async function advanceCrawlTransport(req, res) {
  let sheetUrl = req.body.sheet_id;
  let recipeId = req.body.recipe_id;
  // Start timer
  let startTime = Date.now();
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
