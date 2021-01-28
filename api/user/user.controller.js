const {
  addUser,
  setUserByToken,
  getUserByEmail,
  getUserByToken,
  getProductListMini,
  getProductList,
  getChooseList,
  paymentTry,
  setInvoiceId,
  getPaymentAmount,
  paymentCallback,
  checkDaatgal,
  sendMail,
  setCode,
  addLocation,
  getUserLocationList,
} = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const axios = require("axios");
const moment = require("moment");
const random = require("random");

const numberRegex = /[7-9][0-9]{7}/g;
const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const qpayLink = "https://merchant.qpay.mn";

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
      const userid = results.id;
      checkDaatgal(userid, (err, results2) => {
        if (err) {
          return res.json({
            success: false,
            message: "Алдаа гарлаа: " + err,
          });
        } else {
          const endDate = results2
            ? results2.end_date
              ? results2.end_date
              : "1970/01/01 00:00:00"
            : "1970/01/01 00:00:00";
          console.log("end date: ", endDate);
          if (
            moment(endDate).isBefore(moment().format("YYYY-MM-DD hh:mm:ss"))
          ) {
            getChooseList((err, results3) => {
              if (err) {
                return res.json({
                  success: false,
                  message: "Алдаа гарлаа: " + err,
                });
              } else {
                return res.json({
                  success: true,
                  daatgal: false,
                  data: results3,
                });
              }
            });
          } else {
            getUserLocationList(userid, (err, results4) => {
              if (err) {
                return res.json({
                  success: false,
                  message: "Алдаа гарлаа: " + err,
                });
              } else {
                return res.json({
                  success: true,
                  daatgal: true,
                  data: results4,
                });
              }
            });
          }
        }
      });
    });
  },
  getPayment: (req, res) => {
    const token = req.get("authorization");
    const chooseid = req.params.id;
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
      getPaymentAmount(chooseid, (err, amount) => {
        if (err) {
          console.log(err);
          return res.json({
            success: false,
            message: "Алдаа гарлаа: " + err,
          });
        } else {
          const userId = results.id;
          paymentTry(results.id, chooseid, (err, result) => {
            if (err) {
              console.log(err);
              return res.json({
                success: false,
                message: "Алдаа гарлаа 1: " + err,
              });
            } else {
              const username = "TEST_MERCHANT";
              const password = "123456";

              const token = Buffer.from(
                `${username}:${password}`,
                "utf8"
              ).toString("base64");
              axios({
                method: `POST`,
                url: `${qpayLink}/v2/auth/token`,
                headers: {
                  Authorization: `Basic ${token}`,
                },
              })
                .then((response) => {
                  if (response.data.access_token) {
                    axios({
                      method: `POST`,
                      url: `${qpayLink}/v2/invoice`,
                      headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                        "Content-Type": `application/json`,
                      },
                      data: {
                        invoice_code: "TEST_INVOICE",
                        sender_invoice_no: result.toString(),
                        invoice_receiver_code: userId.toString(),
                        invoice_description:
                          result.toString() + " " + userId.toString(),
                        amount: amount,
                        callback_url: `http://45.55.39.15:8080/api/user/paymentCallback/${result}`,
                      },
                    })
                      .then((response) => {
                        console.log("Get Qr: " + response.data.invoice_id);
                        setInvoiceId(
                          result,
                          response.data.invoice_id,
                          (err) => {
                            if (err) {
                              return res.json({
                                success: false,
                                message: "Алдаа гарлаа: " + err,
                              });
                            } else {
                              return res.json({
                                success: true,
                                data: response.data,
                              });
                            }
                          }
                        );
                      })
                      .catch((err) => {
                        return res.json({
                          success: false,
                          message: "Алдаа гарлаа 2: " + err,
                        });
                      });
                  } else {
                    console.log(response.data);
                  }
                })
                .catch((err) => {
                  return res.json({
                    success: false,
                    message: "Алдаа гарлаа 3: " + err,
                  });
                });
            }
          });
        }
      });
    });
  },
  paymentCallback: (req, res) => {
    const paymentId = req.params.id;
    paymentCallback(paymentId, (err, results) => {
      if (err) {
        return res.json({
          success: false,
          message: "Алдаа гарлаа: " + err,
        });
      } else {
        const username = "TEST_MERCHANT";
        const password = "123456";

        const token = Buffer.from(`${username}:${password}`, "utf8").toString(
          "base64"
        );
        axios({
          method: `POST`,
          url: `${qpayLink}/v2/auth/token`,
          headers: {
            Authorization: `Basic ${token}`,
          },
        })
          .then((response) => {
            if (response.data.access_token) {
              axios({
                method: `POST`,
                url: `${qpayLink}/v2/payment/check`,
                headers: {
                  Authorization: `Bearer ${response.data.access_token}`,
                  "Content-Type": `application/json`,
                },
                data: {
                  object_type: "INVOICE",
                  object_id: results.invoice_id.toString(),
                  offset: {
                    page_number: 1,
                    page_limit: 100,
                  },
                },
              })
                .then((response) => {
                  console.log(
                    "Payment Status: " + response.data.rows[0].payment_status
                  );
                  if (response.data.rows[0].payment_status == "PAID") {
                    startDaatgal(
                      results.id,
                      results.user_id,
                      results.choose_id,
                      (err) => {
                        if (err) {
                          return res.json({
                            success: false,
                            message: "Алдаа гарлаа 5: " + err,
                          });
                        } else {
                          return res.json({
                            success: true,
                            message: "Амжилттай даатгагдлаа.",
                          });
                        }
                      }
                    );
                  }
                })
                .catch((err) => {
                  return res.json({
                    success: false,
                    message: "Алдаа гарлаа 2: " + err,
                  });
                });
            } else {
              console.log(response.data);
            }
          })
          .catch((err) => {
            return res.json({
              success: false,
              message: "Алдаа гарлаа 3: " + err,
            });
          });
      }
    });
  },
  checkDaatgal: (req, res) => {
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
      const userid = results.id;
      checkDaatgal(userid, (err, results2) => {
        if (err) {
          return res.json({
            success: false,
            message: "Алдаа гарлаа: " + err,
          });
        } else {
          if (
            moment(results2.end_date).isBefore(
              moment().format("YYYY-MM-DD hh:mm:ss")
            ) ||
            !results2.end_date
          ) {
            return res.json({
              success: false,
              daatgal: false,
              message: "Даатгалгүй байна.",
            });
          } else {
            const code = random.int(10000000, 99999999);
            console.log("code: ", code);
            sendMail(results2.email, code);
            const salt = genSaltSync(10);
            const hashCode = hashSync(code.toString(), salt);
            setCode(userid, hashCode, (err) => {
              if (err) {
                return res.json({
                  success: false,
                  message: "Алдаа гарлаа 6: " + err,
                });
              } else {
                return res.json({
                  success: true,
                  daatgal: true,
                  data: {
                    start_date: results2.start_date,
                    end_date: results2.end_date,
                    duration: results2.duration,
                    price: results2.price,
                    code: true,
                  },
                });
              }
            });
          }
        }
      });
    });
  },
  codeAgain: (req, res) => {
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
      const userid = results.id;
      const code = random.int(10000000, 99999999);
      console.log("code: ", code);
      console.log("email: ", results.email);
      sendMail(results.email, code);
      const salt = genSaltSync(10);
      const hashCode = hashSync(code.toString(), salt);
      setCode(userid, hashCode, (err) => {
        if (err) {
          return res.json({
            success: false,
            message: "Алдаа гарлаа: " + err,
          });
        } else {
          return res.json({
            success: true,
            email: results.email,
          });
        }
      });
    });
  },
  addLocation: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    if (
      body.location_x == "" ||
      body.location_y == "" ||
      !body.location_x ||
      !body.location_y
    ) {
      return res.json({
        success: false,
        message: "Параметр буруу илгээсэн!",
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
      const userid = results.id;
      addLocation(body, userid, (err) => {
        if (err) {
          return res.json({
            success: false,
            message: "Алдаа гарлаа: " + err,
          });
        } else {
          return res.json({
            success: true,
            message: "Амжилттай бүртгэлээ!",
          });
        }
      });
    });
  },
};
