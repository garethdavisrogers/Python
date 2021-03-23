CREATE DATABASE IF NOT EXISTS ratings_and_reviews;
SET GLOBAL local_infile = true;
USE ratings_and_reviews;
CREATE TABLE IF NOT EXISTS reviews(
  id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date DATE NOT NULL,
  summary VARCHAR(300) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR(200) NOT NULL,
  reviewer_email VARCHAR(200) NOT NULL,
  response VARCHAR(300),
  helpfulness INT NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS review_photos (
  id INT NOT NULL,
  review_id INT NOT NULL,
  _url CHAR NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id INT NOT NULL,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value INT NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS characteristics (
  id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE reviews
ADD INDEX (product_id);
ALTER TABLE review_photos
ADD INDEX (review_id);
ALTER TABLE characteristics
ADD INDEX (product_id);
ALTER TABLE characteristic_reviews
ADD INDEX (review_id);
-- CREATE INDEX prod ON reviews(product_id);
-- SELECT *
-- FROM reviews,
--   review_photos.url
-- FROM reviews
--   INNER JOIN review_photos ON reviews.id = review_photos.review_id;