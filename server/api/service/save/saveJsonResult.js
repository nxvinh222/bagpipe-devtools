const path = require("path");
var fs = require("fs");
const { log } = require("console");

async function SaveJsonResult(result, generatedFileName) {
  // Define relative path name
  const fileName = path.resolve(
    __dirname,
    `../../../result/${generatedFileName}`
  );

  // Save file
  let parsed = JSON.stringify(result);
  try {
    fs.writeFile(fileName, parsed, { flag: "a+" }, function (err) {
      if (err) throw err;
      console.log("[INFO] Json result saved");
    });
  } catch (error) {
    console.log("[ERROR] Cannot save Json result");
  }

}

module.exports = SaveJsonResult;
