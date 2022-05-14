const advanceCrawlService = require('../service/advanceCrawl');
const SaveJsonResult = require('../service/save/saveJsonResult');
const responseSuccess = require("./response/successResponse");

async function advanceCrawlTransport(req, res) {
    try {
        const result = await advanceCrawlService(req.body)
        console.log("Scraping done! Streaming to client!");
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
        responseSuccess(res, `${fileName}`);
    } catch (error) {
        console.log("Scrape failed: ", error);
        res.status(500).send({ error: "Scrape failed, please try again!" })
    }
}

module.exports = advanceCrawlTransport;