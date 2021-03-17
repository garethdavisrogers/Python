const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sdc",
  password: "password",
  port: 5432,
});

// pool.connect((err, client, done) => {
//   if (err) throw err;
//   client.query("SELECT * FROM users WHERE id = $1", [1], (err, res) => {
//     done();
//     if (err) {
//       console.log(err.stack);
//     } else {
//       console.log(res.rows[0]);
//     }
//   });
// });

// TODO: MUST ALWAYS RETURN A CLIENT TO POOL.
// single query createss a
// pool.query("SELECT NOW()", (err, res) => {
//   console.log(err, res);
//   pool.end();
// });

// const client = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "postgres",
//   password: "password",
//   port: 5432,
// });
// client.connect();
// client.query("SELECT NOW()", (err, res) => {
//   console.log(err, res);
//   client.end();
// });
module.exports = pool;
