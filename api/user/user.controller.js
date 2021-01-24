const {
  addUser,
  setUserByToken,
  getUserByEmail,
  getUserByToken,
  getProductListMini,
  getProductList,
  getChooseList,
} = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const numberRegex = /[7-9][0-9]{7}/g;
const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
  userReg: (req, res) => {
    const body = req.body;
    if (
      body.lastname == "" ||
      body.firstname == "" ||
      body.password == "" ||
      body.telnumber == "" ||
      body.email == "" ||
      !body.lastname ||
      !body.firstname ||
      !body.password ||
      !body.telnumber ||
      !body.email
    ) {
      return res.json({
        success: false,
        message: "Бүрэн гүйцэд бөглөнө үү.",
      });
    }
    if (!body.telnumber.match(numberRegex)) {
      return res.json({
        success: false,
        message: "Утасны дугаарын формат буруу байна.",
      });
    }
    if (!body.email.match(emailRegex)) {
      return res.json({
        success: false,
        message: "И-мэйлийн формат буруу байна.",
      });
    }
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    addUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      } else {
        return res.json({
          success: true,
          message: "Амжилттай нэмлээ.",
        });
      }
    });
  },
  userLogin: (req, res) => {
    const body = req.body;
    if (
      body.password == "" ||
      body.email == "" ||
      !body.password ||
      !body.email
    ) {
      return res.json({
        success: false,
        message: "Бүрэн гүйцэд бөглөнө үү.",
      });
    }
    getUserByEmail(body.email, (err, results) => {
      if (err) console.log(err);
      if (!results) {
        return res.json({
          success: false,
          message: "И-мэйл эсвэл нууц үг буруу байна.",
        });
      }
      const isEqual = compareSync(body.password, results.pass);
      if (isEqual) {
        const jsonToken = sign(
          {
            email: results.email,
            id: results.id,
            telnumber: results.telnumber,
          },
          process.env.PASSWORD_ENC
        );
        setUserByToken(jsonToken, results.id, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: "Алдаа гарлаа",
            });
          }
        });
        results.id = undefined;
        results.email = undefined;
        results.telnumber = undefined;
        results.pass = undefined;
        results.created_date = undefined;
        results.token = undefined;
        results.code = undefined;
        return res.json({
          success: true,
          data: results,
          token: jsonToken,
        });
      } else {
        return res.json({
          success: false,
          message: "И-мэйл эсвэл нууц үг буруу байна.",
        });
      }
    });
  },
  productListMini: (req, res) => {
    const token = req.get("authorization");
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) console.log(err);
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      getProductListMini((err, results) => {
        if (err) {
          return res.json({
            success: false,
            message: "Алдаа гарлаа: " + err,
          });
        } else {
          results = results.map((item, idx) => {
            return {
              id: item.id,
              imgLink:
                req.protocol +
                "://" +
                req.hostname +
                ":8080" +
                "/images/" +
                item.imgLink,
              name: item.name,
              total: item.total,
              price: item.price,
              description: item.description,
              createdDate: item.createdDate,
            };
          });
          return res.json({
            success: true,
            data: results,
          });
        }
      });
    });
  },
  productList: (req, res) => {
    const token = req.get("authorization");
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) console.log(err);
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      getProductList((err, results) => {
        if (err) {
          return res.json({
            success: false,
            message: "Алдаа гарлаа: " + err,
          });
        } else {
          results = results.map((item, idx) => {
            return {
              id: item.id,
              imgLink:
                req.protocol +
                "://" +
                req.hostname +
                ":8080" +
                "/images/" +
                item.imgLink,
              name: item.name,
              total: item.total,
              price: item.price,
              description: item.description,
              createdDate: item.createdDate,
            };
          });
          return res.json({
            success: true,
            data: results,
          });
        }
      });
    });
  },
  chooseList: (req, res) => {
    const token = req.get("authorization");
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) console.log(err);
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      getChooseList((err, results) => {
        if (err) {
          return res.json({
            success: false,
            message: "Алдаа гарлаа: " + err,
          });
        } else {
          return res.json({
            success: true,
            data: results,
          });
        }
      });
    });
  },
};
