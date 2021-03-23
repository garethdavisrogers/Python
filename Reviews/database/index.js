const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Constantine123",
  database: "ratings_and_reviews",
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Connected");
  }
});

module.exports = db;
