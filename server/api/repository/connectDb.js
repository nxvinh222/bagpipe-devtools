const { Client } = require("pg");
const client = require("pg/lib/native/client");

async function connectDb() {
  //   const client = new Client({
  //     user: process.env.DB_USER,
  //     host: process.env.DB_HOST,
  //     database: process.env.DB_NAME,
  //     password: process.env.DB_PASSWORD,
  //     port: process.env.DB_PORT,
  //   });
  //   await client.connect();
}

module.exports = connectDb;
