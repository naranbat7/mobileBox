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
  userList: (callback) => {
    pool.query(
      `select u.id, u.lastname, u.firstname, u.telnumber, u.imei, u.email, adddate(d.start_date, interval i.duration month) as end_date from user u left join daatgal d on u.id = d.userid left join insurance_choose i on d.chooseid = i.id;`,
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа!");
        }
        return callback(null, results);
      }
    );
  },
  deleteUser: (id, callback) => {
    pool.query(
      `delete from user where id = ?;`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа!");
        }
        return callback(null);
      }
    );
  },
  changeInsuranceDate: (body, callback) => {
    pool.query(
      `update daatgal set start_date = adddate(start_date, interval ? month) where id = ?;`,
      [body.value, body.id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа!");
        }
        return callback(null);
      }
    );
  },
  setUser: (body, callback) => {
    pool.query(
      `update user set lastname = ?, firstname = ?, email = ?, telnumber = ?, imei = ? where id = ?;`,
      [
        body.lastname,
        body.firstname,
        body.email,
        body.telnumber,
        body.imei || null,
        body.id,
      ],
      (error, results, fields) => {
        if (error) {
          return callback("Бүртгэлтэй утасны дугаар эсвэл и-мэйл байна.");
        }
        return callback(null);
      }
    );
  },
  addProduct: (body, callback) => {
    pool.query(
      `insert into product (name, total, price, description) values (?, ?, ?, ?);`,
      [body.name, body.total, body.price, body.description || null],
      (error, results, fields) => {
        if (error) {
          return callback("Барааны нэр бүртгэлтэй байна.");
        } else {
          pool.query(
            `select id from product where name = ?;`,
            [body.name],
            (error, results, fields) => {
              if (error) {
                return callback("Алдаа гарлаа.");
              } else {
                return callback(null, results[0]);
              }
            }
          );
        }
      }
    );
  },
  deleteProduct: (body, callback) => {
    pool.query(
      `delete from product where id = ?;`,
      [body.id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа. " + error);
        } else {
          return callback(null);
        }
      }
    );
  },
  setProductImage: (body, callback) => {
    pool.query(
      `update product set imgLink = ? where id = ?;`,
      [body.id + ".png", body.id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа. " + error);
        } else {
          return callback(null);
        }
      }
    );
  },
  productList: (callback) => {
    pool.query(`select * from product;`, (error, results, fields) => {
      if (error) {
        return callback("Алдаа гарлаа. " + error);
      } else {
        return callback(null, results);
      }
    });
  },
  setProduct: (body, callback) => {
    pool.query(
      `update product set name = ?, description = ?, total = ?, price = ? where id = ?;`,
      [body.name, body.description || null, body.total, body.price, body.id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа. " + error);
        } else {
          return callback(null);
        }
      }
    );
  },
  checkUserCode: (body, callback) => {
    pool.query(
      `select * from user where id = ?;`,
      [body],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа. " + error);
        } else {
          return callback(null, results[0]);
        }
      }
    );
  },
  getUserLocation: (body, callback) => {
    pool.query(
      `select * from location where userid = ? order by location_date desc limit 10;`,
      [body],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа. " + error);
        } else {
          return callback(null, results);
        }
      }
    );
  },
};
