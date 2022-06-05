const simpleCrawlService = require('../service/simpleCrawl');

async function simpleCrawlTransport(req, res) {
    try {
        const result = await simpleCrawlService(req.body)
        console.log("Scraping done! Streaming to client!");
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
        res.status(500).send({ error: "Scrape failed, please try again!" })
    }
}

module.exports = simpleCrawlTransport;