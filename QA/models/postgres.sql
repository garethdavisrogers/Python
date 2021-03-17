# Create tables in db.

-- CREATE DATABASE sdc;
-- USE sdc;

CREATE TABLE questions(
  id SERIAL UNIQUE,
  product_id INT,
  body VARCHAR(1000) NOT NULL,
  date_written DATE NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60),
  reported INT DEFAULT 0,
  helpful INT DEFAULT 0,
  PRIMARY KEY(id)
);

CREATE TABLE answers(
  id SERIAL UNIQUE,
  question_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date_written DATE NOT NULL,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  helpful INT DEFAULT 0,
  reported INT DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE photos(
 id SERIAL UNIQUE,
 answer_id INT NOT NULL,
 url VARCHAR(1000) NOT NULL,
 PRIMARY KEY (id)
);