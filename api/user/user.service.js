const pool = require("../../config/database");

module.exports = {
  addUser: (body, callback) => {
    pool.query(
      `insert into user (lastname, firstname, email, telnumber, pass) values
      (?, ?, ?, ?, ?);`,
      [
        body.lastname,
        body.firstname,
        body.email,
        body.telnumber,
        body.password,
      ],
      (error, results, fields) => {
        if (error) {
          return callback("Утасны дугаар эсвэл и-мэйл бүртгэлтэй байна.");
        }
        return callback(null);
      }
    );
  },
  setUserByToken: (token, id, callback) => {
    pool.query(
      `update user set token = ? where id = ?;`,
      [token, id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null);
      }
    );
  },
  getUserByEmail: (body, callback) => {
    pool.query(
      `select * from user where email = ?;`,
      [body],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
};
