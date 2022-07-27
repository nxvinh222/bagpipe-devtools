const path = require("path");
const SaveSheet = require("../service/save/saveSheet");
const responseSuccess = require("./response/successResponse");
const fs = require('fs');
const flatten = require("../../utils/flatten");

async function exportSheet(req, res) {
    try {
        const filename = path.resolve(
            __dirname,
            `../../result/${req.body.filename.split(".")[0]}.json`
        );
        const sheetUrl = req.body.sheet_url;
        console.log("[LOG] filename: ", req.body.filename);
        console.log("[LOG] sheetURL: ", req.body.sheet_url);
        let result = fs.readFileSync(filename);
        result = JSON.parse(result);
        try {
            await SaveSheet(sheetUrl, flatten(result));
        } catch (error) {
            console.log("[ERROR] Cannot save to sheet: ", error.message);
        }
    } catch (error) {
        console.log("[ERROR] Cannot export result to Google Sheet: ", error);
        res.status(500).send({ error: "Cannot export result to Google Sheet" })
    }
}

module.exports = exportSheet;