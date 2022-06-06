const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("../../../credentials.json");

async function SaveSheet(sheetUrl, result) {
  // Return if user don't enter sheet Url
  if (sheetUrl == null) return;

  let sheetId;
  // Check if sheet Url valid
  if (sheetUrl.split("/").length >= 6) {
    sheetId = sheetUrl.split("/")[5];
  } else {
    sheetId = "";
  }
  // Return if sheet Url invalid
  if (sheetId == "") {
    return;
  }
  console.log("[INFO] Saving result data to sheet: ", sheetId);

  // Only get first key in result
  let values;
  for (var key in result) {
    values = result[key];
    break;
  }
  //   console.log(values);
  //   console.log("keys: ", Object.keys(values[0]));
  const doc = new GoogleSpreadsheet(sheetId);
  try {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const worksheet = doc.sheetsByIndex[0]; // Here, 1st tab on Google Spreadsheet is used.
    await worksheet.updateProperties({ title: key });

    await worksheet.setHeaderRow(Object.keys(values[0])); // This is the header row.
    await worksheet.addRows(values); // Your value is put to the sheet.
    console.log("[INFO] Result data saved to sheet: ", sheetId);
  } catch (error) {
    console.log("[ERROR] Cannot save to sheet");
    throw error;
  }
}

module.exports = SaveSheet;
