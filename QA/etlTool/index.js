const fs = require("fs");
const path = require("path");
const readLine = require("readline");

const pool = require("../models/pg");

const files = {
  photos: path.join(__dirname, "../rawData", "answers_photos.csv"),
  answers: path.join(__dirname, "../rawData", "answers.csv"),
  questions: path.join(__dirname, "../rawData", "questions.csv"),
};

const createTables = () => {
  pool.query(
    `CREATE TABLE IF NOT EXISTS photos(
    id SERIAL UNIQUE,
    answer_id INT NOT NULL,
    url VARCHAR(1000) NOT NULL,
    PRIMARY KEY (id)
   );`,
    (err, result) => {
      if (err) {
        throw new Error(err);
      }
    }
  );
  pool.query(
    `CREATE TABLE IF NOT EXISTS answers(
    id SERIAL UNIQUE,
    question_id INT NOT NULL,
    body VARCHAR(1000) NOT NULL,
    date_written DATE NOT NULL,
    answerer_name VARCHAR(60) NOT NULL,
    answerer_email VARCHAR(60) NOT NULL,
    helpful INT DEFAULT 0,
    reported INT DEFAULT 0,
    PRIMARY KEY (id)
  );`,
    (err, result) => {
      if (err) {
        throw new Error(err);
      }
    }
  );
  pool.query(
    `CREATE TABLE IF NOT EXISTS questions(
    id SERIAL UNIQUE,
    product_id INT,
    body VARCHAR(1000) NOT NULL,
    date_written DATE NOT NULL,
    asker_name VARCHAR(60) NOT NULL,
    asker_email VARCHAR(60),
    reported INT DEFAULT 0,
    helpful INT DEFAULT 0,
    PRIMARY KEY(id)
  );`,
    (err, result) => {
      if (err) {
        throw new Error(err);
      }
    }
  );
};

const loadData = () => {
  pool.query(
    `COPY answers(id, question_id, body, date_written, answerer_name, answerer_email, helpful, reported) FROM ${files.answers} DELIMITER ',' csv header;`
  );
  pool.query(
    `COPY photos(id, answer_id, url) FROM ${files.photos} DELIMITER ',' csv header;`
  );
  pool.query(
    `COPY questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful) FROM ${files.questions} DELIMITER ',' csv header;`
  );
};

// const fileObject = {
//   photos: files[0],
//   answers: files[1],
//   questions: files[2],
// };

// const readInData = (table) => {
//   if (!fileObject[table]) {
//     return;
//   }

//   const rawData = fileObject[table];
//   const stream = fs.createReadStream(rawData, "utf8");

//   const line = readLine.createInterface({
//     input: stream,
//   });

//   let currentLineCount = 0;
//   let dataObjects = [];
//   let values = [];

//   line.on("line", (data) => {
//     let dataObj = {};
//     if (currentLineCount === 0) {
//       values = data.toString().split(",");
//       // FIXME: split on " or comma then check what the char to the right of it is. if it's a "",
//       // We know that the split was ok, if not we need to find the first index with a comma, and join everything between the two commas. Something like that.
//       currentLineCount += 1;
//     } else {
//       let dataValues = data.split(",");
//       pool.query(
//         "INSERT INTO photos(id, answer_id, url) VALUES($1, $2, $3)",
//         dataValues,
//         (err, result) => {
//           if (err) {
//             return console.error("Error on query.", err.stack);
//           }

//           console.log("Processing: ", currentLineCount);
//         }
//       );
//       currentLineCount += 1;
//     }
//   });
// };
// readInData("answers");
