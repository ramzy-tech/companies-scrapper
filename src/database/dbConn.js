require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  timezone: "local",
});

async function excuteQuery({ query, values }) {
  try {
    return new Promise((resolve, reject) =>
      connection.execute(query, values, (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    );
  } catch (error) {
    console.log("error here.");
    console.log(error);
    return { error };
  }
}

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to Mysql");
});

module.exports = {
  excuteQuery,
  connection,
};
