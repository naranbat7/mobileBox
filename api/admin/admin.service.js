const pool = require("../../config/database");

module.exports = {
  getUserByUsername: (username, callback) => {
    pool.query(
      `select * from admin where username = ?`,
      [username],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  getUserByToken: (token, callback) => {
    pool.query(
      `select * from admin where token = ?`,
      [token],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  setToken: (token, username) => {
    pool.query(`update admin set token=? where username=?`, [token, username]);
  },
  addAdminByBody: (body, callback) => {
    pool.query(
      `insert into admin (name, telnumber, username, pass, isfulladmin) values
      (?, ?, ?, ?, ?);`,
      [
        body.name,
        body.telnumber || null,
        body.username,
        body.password,
        body.isFullAdmin,
      ],
      (error, results, fields) => {
        if (error) {
          return callback("Нэвтрэх нэр эсвэл утасны дугаар ашиглагдсан байна!");
        }
        return callback(null);
      }
    );
  },
  setUserByToken: (token, body, callback) => {
    pool.query(
      `update admin set name = ?, telnumber = ?, username = ?, pass = ?, isfulladmin = ? where token = ?;`,
      [
        body.name,
        body.telnumber || null,
        body.username,
        body.password,
        body.isFullAdmin,
        token,
      ],
      (error, results, fields) => {
        if (error) {
          return callback("Нэвтрэх нэр эсвэл утасны дугаар ашиглагдсан байна!");
        }
        return callback(null);
      }
    );
  },
  adminList: (token, callback) => {
    pool.query(
      `select id, name, telnumber, username, pass, isfulladmin from admin where id not in (select id from admin where token = ?)`,
      [token],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа!");
        }
        return callback(null, results);
      }
    );
  },
  deleteAdmin: (body, callback) => {
    pool.query(
      `delete from admin where id = ?;`,
      [body.id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа!");
        }
        return callback(null);
      }
    );
  },
  setUserById: (token, body, callback) => {
    pool.query(
      `update admin set name = ?, telnumber = ?, username = ?, pass = ?, isfulladmin = ? where id = ?;`,
      [
        body.name,
        body.telnumber || null,
        body.username,
        body.password,
        body.isFullAdmin,
        body.id,
      ],
      (error, results, fields) => {
        if (error) {
          return callback("Нэвтрэх нэр эсвэл утасны дугаар ашиглагдсан байна!");
        }
        return callback(null);
      }
    );
  },
};
