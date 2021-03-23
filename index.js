const path = require("path");
const fs = require("fs");
const db = require("./Reviews/database/index.js");
const readline = require("readline");
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`server is up and running on ${port}`);
});

app.get("/reviews", (req, res) => {
  let reqQuery = req.query;
  let response = getReviews(
    (err, results) => {
      if (err) {
        throw err;
      } else {
        res.send(results);
      }
    },
    reqQuery.product_id,
    reqQuery.count
  );
});

app.get("/reviews/meta", (req, res) => {
  let reqQuery = req.query;
  let response = getReviewMetaData((err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  }, reqQuery.product_id);
});

const getReviews = (cb, product_id, count, page, sort) => {
  count = count || 5;
  page = page || 1;
  let resObj = { product: product_id, page: page, count: count };
  let queryStr = `SELECT r.id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, rp.id AS photoId, rp.url FROM reviews AS r LEFT JOIN review_photos AS rp ON r.id = rp.review_id WHERE r.product_id=${product_id}`;
  db.query(queryStr, (err, results) => {
    if (err) {
      cb(err);
    } else {
      let uniqueKeys = [];
      let nonDuplicate = [];
      let photosObj = {};
      results.forEach((result) => {
        let photoObj = {};
        if (result.photoId) {
          photoObj.photoId = result.photoId;
          photoObj.url = result.url;
          if (photosObj[result.id]) {
            photosObj[result.id].push(photoObj);
          } else {
            photosObj[result.id] = [photoObj];
          }
        }
        if (!uniqueKeys.includes(result.id)) {
          delete result.photoId;
          delete result.url;
          uniqueKeys.push(result.id);
          nonDuplicate.push(result);
        }
      });
      nonDuplicate.forEach((item) => {
        if (photosObj[item.id]) {
          item.photos = photosObj[item.id];
        } else {
          item.photos = [];
        }
      });
      resObj.results = nonDuplicate;
      cb(null, resObj);
    }
  });
};

const getReviewMetaData = (cb, productId) => {
  db.query(
    `SELECT r.product_id, r.rating, r.recommend, c.name, c.id, cr.value FROM reviews AS r LEFT JOIN characteristics AS c ON r.product_id = c.product_id LEFT JOIN characteristic_reviews AS cr ON c.id = cr.characteristic_id AND r.id=cr.review_id WHERE r.product_id=${productId};`,
    (err, results) => {
      if (err) {
        cb(err);
      } else {
        let resObj = { product_id: productId };
        let ratingsObj = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let recommendObj = { 0: 0 };
        let characteristicsObj = {};
        let charValObj = {};
        let charMentionCounter = {};
        results.forEach((result) => {
          let currentRating = result.rating;
          ratingsObj[currentRating] += 1;
          recommendObj[0] += result.recommend;
          if (!characteristicsObj[result.name]) {
            characteristicsObj[result.name] = { id: result.id, value: 0 };
            charValObj[result.name] = result.value;
            charMentionCounter[result.name] = 1;
          } else {
            charValObj[result.name] += result.value;
            charMentionCounter[result.name] += 1;
          }
        });
        resObj.ratings = ratingsObj;
        resObj.characteristics = characteristicsObj;
        for (let key in charValObj) {
          debugger;
          let valKey = charValObj[key];
          let mentions = charMentionCounter[key];
          let avg = valKey / mentions;
          resObj.characteristics[key].value += avg;
        }
        cb(null, resObj);
      }
    }
  );
};

const reviewsFilePath = "Reviews/rawData/reviews.csv";
const reviewPhotosFilePath = "Reviews/rawData/reviews_photos.csv";
const characteristicReviewsFilePath =
  "Reviews/rawData/characteristic_reviews.csv";
const characteristicsFilePath = "Reviews/rawData/characteristics.csv";
const linebreak = "\n";
const doubleQuote = '"';

const createReviewsTable = (database) => {
  let rows = `LOAD DATA LOCAL INFILE '${reviewsFilePath}' INTO TABLE reviews FIELDS TERMINATED BY ',' ENCLOSED BY '${doubleQuote}' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness);`;

  db.query(rows, (error, result) => {
    if (error) {
      throw error;
    } else {
      () => {};
    }
  });
};

const createReviewPhotosTable = (database) => {
  let rows = `LOAD DATA LOCAL INFILE '${reviewPhotosFilePath}' INTO TABLE review_photos FIELDS TERMINATED BY ',' ENCLOSED BY '${doubleQuote}' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id, review_id, _url);`;
  db.query(rows, (error, results) => {
    if (error) {
      throw error;
    } else {
      () => {};
    }
  });
};

const createCharacteristicsReviewsTable = (database) => {
  let rows = `LOAD DATA LOCAL INFILE '${characteristicReviewsFilePath}' INTO TABLE characteristic_reviews FIELDS TERMINATED BY ',' ENCLOSED BY '${doubleQuote}' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id,characteristic_id,review_id,value);`;
  db.query(rows, (error, results) => {
    if (error) {
      throw error;
    } else {
      () => {};
    }
  });
};

const createCharacteristicsTable = (database) => {
  let rows = `LOAD DATA LOCAL INFILE '${characteristicsFilePath}' INTO TABLE characteristics FIELDS TERMINATED BY ',' ENCLOSED BY '${doubleQuote}' LINES TERMINATED BY '\n' IGNORE 1 ROWS (id,product_id,name);`;
  db.query(rows, (error, results) => {
    if (error) {
      throw error;
    } else {
      () => {};
    }
  });
};

const checkTable = (table, cb) => {
  let queryStr = `SELECT COUNT(*) FROM ${table}`;
  db.query(queryStr, (err, results) => {
    if (err) {
      throw err;
    } else {
      let resultObj = results[0];
      if (resultObj["COUNT(*)"] === 0) {
        cb(db);
      }
    }
  });
};

checkTable("reviews", createReviewsTable);
checkTable("review_photos", createReviewPhotosTable);
checkTable("characteristics", createCharacteristicsTable);
checkTable("characteristic_reviews", createCharacteristicsReviewsTable);
