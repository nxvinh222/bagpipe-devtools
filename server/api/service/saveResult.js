const path = require("path");
var fs = require("fs");

async function SaveResult(client, result) {
  const json = JSON.stringify(result);
  const fileName = path.resolve(__dirname, `../../result/${Date.now()}.txt`);
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
    fs.writeFile(fileName, parsed, { flag: "a+" }, function (err) {
      if (err) throw err;
      console.log("It's saved!");
    });
    break;
  }

  // let data = [{ "price": "7,590,000₫", "duration": "4 ngày" }, { "price": "9,390,000₫", "duration": "5 ngày" }];
  // GET KEY LIST
  let keyList = [];
  for (var key in data[0]) {
    keyList.push(key);
  }
  let columnList = '"' + keyList.join('","') + '"';
  console.log("keys: ", keyList);

  // CREATE TABLE
  var dropQuery = `DROP TABLE IF EXISTS ${tableName}`;
  await client
    .query(dropQuery)
    .then((res) => console.log(`${tableName} table dropped`))
    .catch((e) => console.error(e.stack));

  let createTableMap = keyList.map((key) => {
    return `${key} TEXT`;
  });
  createTableMap = createTableMap.join(", ");
  var createTableQuery = `CREATE TABLE ${tableName} (${createTableMap})`;
  await client
    .query(createTableQuery)
    .then((res) => console.log(`${tableName} table created`))
    .catch((e) => console.error(e.stack));

  // INSERT DATA INTO DB
  let insertMap = keyList.map((key) => {
    return "values->>" + `'${key}' as ${key}`;
  });
  insertMap = insertMap.join(", ");
  // console.log("insert: ", insertMap);
  // path.resolve(__dirname, `../../result/test.txt`)
  var sqlQuery = `BEGIN;\
                                    create temporary table temp_json \
                                    (values text) on \
                                    commit \
                                    drop; \
                                    copy temp_json from '${fileName}'; \
                                insert into ${tableName} (${columnList}) \
                                select ${insertMap}\
                                from\
                                (\
                                        select json_array_elements(replace(values,' \ ',' \ \ ')::json) as values \
                                        from temp_json\
                                ) a;\
                                COMMIT;`;
  // console.log(sqlQuery);
  await client
    .query(sqlQuery)
    // .then(res => console.log(res.rows[0]))
    .then((res) =>
      console.log("[INFO] Insert crawl result into DB succesully!")
    )
    .catch((e) => console.error("add failed: ", e.stack));
  await client.end();
}

module.exports = SaveResult;
