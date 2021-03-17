const express = require("express");
const app = express();
const port = 3000;

// Basic routes.

app.get("/qa/questions", (req, res) => {
  // param product_id mandatory
  // param page default 1
  // param count default 5
  // status 200
});

app.get("/qa/questions/:question_id/answers", (req, res) => {
  // param question_id mandatory
  // page default 1
  // count default 5
  // status 200
});

app.post("/qa/questions", (req, res) => {
  // Needs a body, body must have:
  // body, name, email, product_id
  // status 201
});

app.post("/qa/questions/:question_id/answers", (req, res) => {
  // question_id is mandatory.
  // must have: body, name, email
  // might have: photos
  // status 201
});

app.put("/qa/questions/:question_id/helpful", (req, res) => {
  //needs that id.
  //status 204
});

app.put("/qa/questions/:question_id/report", (req, res) => {
  //needs question id.
  // status 204
});

app.put("/qa/answers/:answer_id/helpful", (req, res) => {
  // needs answer_id
  // status 204
});

app.put("/qa/answers/:answer_id/report", (req, res) => {
  // needs answer_id
  // status 204
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
