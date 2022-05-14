const path = require("path");
var fs = require("fs");
const { log } = require("console");

async function SaveJsonResult(result, generatedFileName) {
    const json = JSON.stringify(result);
    const fileName = path.resolve(
        __dirname,
        `../../../result/${generatedFileName}`
    );
    // const fileName = `/result/test.txt`
    // console.log("r: ", result);
    let data;
    let tableName;
    for (var key in result) {
        // Get table name
        tableName = key;
        // Data without object key name
        data = result[key];

        let parsed = JSON.stringify(result[key]);
        // console.log(key);
        // console.log(parsed);

        // Create temporary data file
        fs.writeFile(fileName, parsed, { flag: "a+" }, function (err) {
            if (err) throw err;
            console.log("It's saved!");
        });
        break;
    }
}

module.exports = SaveJsonResult;
