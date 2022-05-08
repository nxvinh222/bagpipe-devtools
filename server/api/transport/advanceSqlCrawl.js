const { Client } = require('pg');
const sql = require('sql');
var fs = require('fs');
const path = require("path");
const flatten = require('../../utils/flatten');
const advanceCrawlService = require('../service/advanceCrawl');
const { log } = require('console');

async function advanceSqlCrawlTransport(req, res) {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'elements',
        password: 'password',
        port: 5432,
    })
    sql.setDialect('postgres');
    try {
        await client.connect()
    } catch (error) {
        console.log(error);
        res.status(500).send(
            {
                msg: "Db connect failed",
                error: error
            }
        )
    }

    try {
        let result = await advanceCrawlService(req.body)
        console.log("Scraping done! Streaming to client!");
        result = flatten(result);
        const json = JSON.stringify(result);
        const fileName = path.resolve(__dirname, `../../result/${Date.now()}.txt`)
        // const fileName = `/result/test.txt`
        console.log("r: ", result);
        let data;
        let tableName;
        for (var key in result) {
            // Get table name
            tableName = key;
            // Data without object key name
            data = result[key];

            let parsed = JSON.stringify(result[key]);
            console.log(key);
            console.log(parsed);
            fs.writeFile(fileName, parsed, { flag: 'a+' }, function (err) {
                if (err) throw err;
                console.log("It's saved!");
            });
            break;
        }
        // const buf = Buffer.from(json);
        // res.writeHead(200, {
        //     'Content-Type': 'application/octet-stream',
        //     'Content-disposition': 'attachment; filename=data.json'
        // });
        // res.write(buf);
        // res.end();
        // var sqlQuery = fs.readFileSync(path.resolve(__dirname, './test.txt'),
        //     { encoding: 'utf8', flag: 'r' });

        // let data = [{ "price": "7,590,000₫", "duration": "4 ngày" }, { "price": "9,390,000₫", "duration": "5 ngày" }];
        // GET KEY LIST
        let keyList = [];
        for (var key in data[0]) {
            keyList.push(key)
        }
        let columnList = "\"" + keyList.join("\",\"") + "\""
        console.log("keys: ", keyList);

        // CREATE TABLE
        var dropQuery = `DROP TABLE IF EXISTS ${tableName}`
        await client
            .query(dropQuery)
            .then(res => console.log("finish query"))
            .catch(e => console.error(e.stack))

        let createTableMap = keyList.map((key) => {
            return `${key} TEXT`
        })
        createTableMap = createTableMap.join(", ")
        var createTableQuery = `CREATE TABLE ${tableName} (${createTableMap})`;
        await client
            .query(createTableQuery)
            .then(res => console.log("finish query"))
            .catch(e => console.error(e.stack))

        // INSERT DATA INTO DB
        let insertMap = keyList.map((key) => {
            return "values->>" + `'${key}' as ${key}`
        })
        insertMap = insertMap.join(", ")
        console.log("insert: ", insertMap);
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
                                COMMIT;`
        console.log(sqlQuery);
        await client
            .query(sqlQuery)
            // .then(res => console.log(res.rows[0]))
            .then(res => console.log("finish query"))
            .catch(e => console.error("add failed: ", e.stack))
        await client.end()

        res.status(200).send(
            {
                msg: "ok",
            }
        )
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