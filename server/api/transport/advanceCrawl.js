const flatten = require("../../utils/flatten");
const advanceCrawlService = require("../service/advanceCrawl");
const SaveJsonResult = require("../service/save/saveJsonResult");
const SaveSheet = require("../service/save/saveSheet");
const responseSuccess = require("./response/successResponse");

async function advanceCrawlTransport(req, res) {
  let sheetId = req.body.sheet_id;
  try {
    let result = await advanceCrawlService(req.body);
    console.log("[INFO] Scraping done! Streaming to client!");
    if (req.query.flatten == 1) result = flatten(result);
    // const json = JSON.stringify(result);
    // const buf = Buffer.from(json);
    // res.writeHead(200, {
    //     'Content-Type': 'application/octet-stream',
    //     'Content-disposition': 'attachment; filename=data.json'
    // });
    // res.write(buf);
    // res.end();
    const fileName = `${Date.now()}.json`;
    await SaveJsonResult(result, fileName);
    if (sheetId != "") {
      await SaveSheet(sheetId, result);
    }
    responseSuccess(res, `${fileName}`);
  } catch (error) {
    console.log("[ERROR] Scrape failed: ", error);
    res.status(500).send({ error: "Scrape failed, please try again!" });
  }
}

module.exports = advanceCrawlTransport;
