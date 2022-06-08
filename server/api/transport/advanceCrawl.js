const flatten = require("../../utils/flatten");
const advanceCrawlService = require("../service/advanceCrawl");
const SaveJsonResult = require("../service/save/saveJsonResult");
const SaveSheet = require("../service/save/saveSheet");
const responseSuccess = require("./response/successResponse");

async function advanceCrawlTransport(req, res) {
  let sheetUrl = req.body.sheet_id;
  try {
    let result = await advanceCrawlService(req.body);
    console.log("[INFO] Scraping done! Saving result!");

    try {
      await SaveSheet(sheetUrl, flatten(result));
    } catch (error) {
      console.log("[ERROR] Cannot save to sheet: ", error);
    }

    const fileName = `${Date.now()}.json`;
    await SaveJsonResult(result, fileName);
    responseSuccess(res, `${fileName}`);
  } catch (error) {
    console.log("[ERROR] Scrape failed: ", error);
    res.status(500).send({ error: "Scrape failed, please try again!" });
  }
}

module.exports = advanceCrawlTransport;
