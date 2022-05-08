const flatten = require('../../utils/flatten');
const advanceCrawlService = require('../service/advanceCrawl');

async function advanceSqlCrawlTransport(req, res) {
    try {
        let result = await advanceCrawlService(req.body)
        console.log("Scraping done! Streaming to client!");
        result = flatten(result);
        const json = JSON.stringify(result);
        const buf = Buffer.from(json);
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-disposition': 'attachment; filename=data.json'
        });
        res.write(buf);
        res.end();
    } catch (error) {
        console.log("Scrape failed: ", error);
        res.status(500).send(
            {
                msg: "Scrape failed, please try again!",
                error: error
            }
        )
    }
}

module.exports = advanceSqlCrawlTransport;