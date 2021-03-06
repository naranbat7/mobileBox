const pool = require("../../config/database");

const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

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
  getUserByToken: (token, callback) => {
    pool.query(
      `select * from user where token = ?;`,
      [token],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  getProductListMini: (callback) => {
    pool.query(`select * from product limit 5;`, (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },
  getProductList: (callback) => {
    pool.query(`select * from product;`, (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },
  getChooseList: (callback) => {
    pool.query(`select * from insurance_choose;`, (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },
  paymentTry: (userid, chooseid, callback) => {
    pool.query(
      `insert into daatgal_purchase_tries (is_success, user_id, choose_id) values
    (?, ?, ?);`,
      [0, userid, chooseid],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results.insertId);
      }
    );
  },
  setInvoiceId: (id, invoice_id, callback) => {
    pool.query(
      `update daatgal_purchase_tries set invoice_id = ? where id = ?;`,
      [invoice_id, id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null);
      }
    );
  },
  getPaymentAmount: (id, callback) => {
    pool.query(
      `select * from insurance_choose where id = ?;`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0].price);
      }
    );
  },
  paymentCallback: (id, callback) => {
    pool.query(
      `select * from daatgal_purchase_tries where id = ?;`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  startDaatgal: (id, userId, chooseId, callback) => {
    pool.query(
      `insert into daatgal (userid, chooseid) values (?, ?);`,
      [userId, chooseId],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null);
      }
    );
  },
  checkDaatgal: (id, callback) => {
    pool.query(
      `select u.email as email, d.start_date as start_date, adddate(d.start_date, interval i.duration month) as end_date, i.price as price, i.duration as duration from user u left join daatgal d on u.id = d.userid left join insurance_choose i on d.chooseid = i.id where d.userid = ?;`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа!");
        }
        return callback(null, results[0]);
      }
    );
  },
  sendMail: async (email, code) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mobileboxmn@gmail.com", // generated ethereal user
        pass: "zaya120$", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let mailOptions = {
      from: "mobileboxmn@gmail.com",
      to: email,
      subject: "Mobile Box Нууц Код",
      html: `<b>${code}</b>`,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) console.log("Mail error: " + err);
      else console.log("Mail Success");
    });
  },
  setCode: (id, code, callback) => {
    pool.query(
      `update user set code = ? where id = ?;`,
      [code, id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа!");
        }
        return callback(null);
      }
    );
  },
  addLocation: (location_x, location_y, id, callback) => {
    pool.query(
      `insert into location (location_x, location_y, userid) values (?, ?, ?);`,
      [location_x, location_y, id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа!");
        }
        return callback(null);
      }
    );
  },
  getUserLocationList: (id, callback) => {
    pool.query(
      `select location_x, location_y, location_date from location where userid = ? order by location_date desc limit 10;`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback("Алдаа гарлаа!");
        }
        return callback(null);
      }
    );
  },
};
