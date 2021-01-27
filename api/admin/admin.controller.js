const {
  getUserByUsername,
  getUserByToken,
  setToken,
  addAdminByBody,
  setUserByToken,
  adminList,
  deleteAdmin,
  setUserById,
  userList,
  deleteUser,
  changeInsuranceDate,
  setUser,
  addProduct,
  deleteProduct,
  setProductImage,
  productList,
  setProduct,
  checkUserCode,
  getUserLocation,
  getChooseList,
  setDaatgal,
} = require("./admin.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const fs = require("fs");

const numberRegex = /[7-9][0-9]{7}/g;
const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
  adminLogin: (req, res) => {
    const body = req.body;
    getUserByUsername(body.username, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх нэр эсвэл нууц үг буруу",
        });
      }
      const result = compareSync(body.password, results.pass);
      if (result) {
        const jsonToken = sign(
          { username: results.username, id: results.id },
          process.env.PASSWORD_ENC,
          {
            expiresIn: "3h",
          }
        );
        setToken(jsonToken, body.username);

        return res.json({
          success: true,
          message: "Амжилттай нэвтэрлээ",
          token: jsonToken,
        });
      } else {
        return res.json({
          success: false,
          message: "Нэвтрэх нэр эсвэл нууц үг буруу байна",
        });
      }
    });
  },
  loginAdminPanel: (req, res) => {
    const token = req.get("authorization");
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      results.id = undefined;
      results.username = undefined;
      results.pass = undefined;
      results.token = undefined;

      return res.json({
        success: true,
        message: "Амжилттай нэвтэрлээ.",
        data: results,
      });
    });
  },
  addAdmin: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (
      body.name == "" ||
      body.username == "" ||
      body.password == "" ||
      (body.isFullAdmin != 0 && body.isFullAdmin != 1) ||
      !body.name ||
      !body.username ||
      !body.password ||
      body.isFullAdmin == undefined ||
      body.isFullAdmin == null
    ) {
      return res.json({
        success: false,
        message: "Бүрэн гүйцэд бөглөнө үү.",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        addAdminByBody(body, (err) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              message: "Амжилттай нэмлээ",
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  adminInfoByToken: (req, res) => {
    const token = req.get("authorization");
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      results.id = undefined;
      results.token = undefined;
      results.imgLink = undefined;
      results.password = results.pass;
      results.pass = undefined;
      return res.json({
        success: true,
        data: results,
      });
    });
  },
  setAdmin: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (
      body.name == "" ||
      body.username == "" ||
      body.password == "" ||
      (body.isFullAdmin != 0 && body.isFullAdmin != 1) ||
      !body.name ||
      !body.username ||
      !body.password ||
      body.isFullAdmin == undefined ||
      body.isFullAdmin == null
    ) {
      return res.json({
        success: false,
        message: "Бүрэн гүйцэд бөглөнө үү.",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
    });
    setUserByToken(token, body, (err) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      } else {
        return res.json({
          success: true,
          message: "Амжилттай өөрчиллөө.",
        });
      }
    });
  },
  adminList: (req, res) => {
    const token = req.get("authorization");
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        adminList(token, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              data: results,
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  deleteAdmin: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        deleteAdmin(body, (err) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              message: "Амжилттай устлаа.",
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  setOtherAdmin: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (
      body.name == "" ||
      body.username == "" ||
      body.password == "" ||
      (body.isFullAdmin != 0 && body.isFullAdmin != 1) ||
      !body.name ||
      !body.username ||
      !body.password ||
      body.isFullAdmin == undefined ||
      body.isFullAdmin == null
    ) {
      return res.json({
        success: false,
        message: "Бүрэн гүйцэд бөглөнө үү.",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
    });
    const permission = results.isFullAdmin;
    if (permission == 1) {
      setUserById(body, (err) => {
        if (err) {
          console.log(err);
          return res.json({
            success: false,
            message: err,
          });
        } else {
          return res.json({
            success: true,
            message: "Амжилттай өөрчиллөө.",
          });
        }
      });
    }
  },
  userList: (req, res) => {
    const token = req.get("authorization");
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      userList((err, results) => {
        if (err) {
          console.log(err);
          return res.json({
            success: false,
            message: err,
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
  deleteUser: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    if (!body.id || !Number.isInteger(body.id)) {
      return res.json({
        success: false,
        message: "Өгөгдөл буруу байна. Дахин оролдоно уу",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        deleteUser(body.id, (err) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              message: "Амжилттай устгалаа",
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  changeInsuranceDate: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    if (
      !body.id ||
      !Number.isInteger(body.id) ||
      !body.value ||
      !Number.isInteger(body.value)
    ) {
      return res.json({
        success: false,
        message: "Өгөгдөл буруу байна. Дахин оролдоно уу",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        changeInsuranceDate(body, (err) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              message: "Амжилттай сунгалаа.",
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  setUser: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    if (
      !body.id ||
      !Number.isInteger(body.id) ||
      !body.email ||
      body.email == "" ||
      !body.lastname ||
      body.lastname == "" ||
      !body.firstname ||
      body.firstname == "" ||
      !body.telnumber ||
      body.telnumber == ""
    ) {
      return res.json({
        success: false,
        message: "Өгөгдөл буруу байна. Дахин оролдоно уу",
      });
    }
    if (!body.email.match(emailRegex)) {
      return res.json({
        success: false,
        message: "И-мэйлийн формат буруу байна.",
      });
    }
    body.telnumber = body.telnumber.toString();
    if (!body.telnumber.match(numberRegex)) {
      return res.json({
        success: false,
        message: "Утасны дугаарын формат буруу байна.",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        setUser(body, (err) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              message: "Амжилттай өөрчиллөө.",
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  uploadImage: (req, res) => {
    if (req.file) {
      setProductImage(req.body, (err) => {
        if (err) {
          return res.json({
            success: false,
            message: "Алдаа гарлаа. Дахин оролдоно уу",
          });
        }
        return res.json({
          success: true,
          message: "Амжилттай нэмлээ.",
        });
      });
    } else {
      deleteProduct(req.body, (err) => {});
      return res.json({
        success: false,
        message: "Алдаа гарлаа. Дахин оролдоно уу",
      });
    }
  },
  uploadImage2: (req, res) => {
    if (req.file) {
      return res.json({
        success: true,
        message: "Амжилттай өөрчиллөө.",
      });
    } else {
      return res.json({
        success: false,
        message: "Алдаа гарлаа. Дахин оролдоно уу",
      });
    }
  },
  addProduct: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    if (
      !body.name ||
      body.name == "" ||
      !body.total ||
      !Number.isInteger(body.total) ||
      !body.price ||
      !Number.isInteger(body.price)
    ) {
      return res.json({
        success: false,
        message: "Өгөгдөл буруу байна. Дахин оролдоно уу",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        addProduct(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              data: results,
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  deleteProduct: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    if (!body.id || !Number.isInteger(body.id)) {
      return res.json({
        success: false,
        message: "Өгөгдөл буруу байна. Дахин оролдоно уу",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        deleteProduct(body, (err) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            const path = __dirname + "../../../images/" + body.id + ".png";
            fs.unlink(path, (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });
            return res.json({
              success: true,
              message: "Амжилттай устгалаа",
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
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
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        productList((err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
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
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  setProduct: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    if (
      !body.name ||
      body.name == "" ||
      !body.total ||
      !Number.isInteger(body.total) ||
      !body.price ||
      !Number.isInteger(body.price)
    ) {
      return res.json({
        success: false,
        message: "Өгөгдөл буруу байна. Дахин оролдоно уу",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        setProduct(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              message: "Амжилттай өөрчиллөө.",
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  userLastLocation: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    if (
      !body.id ||
      !Number.isInteger(body.id) ||
      !body.code ||
      body.code == ""
    ) {
      return res.json({
        success: false,
        message: "Өгөгдөл буруу байна. Дахин оролдоно уу",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 0) {
        checkUserCode(body.id, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: err,
            });
          } else {
            const result = compareSync(body.code, results.code);
            if (result) {
              getUserLocation(body.id, (err, results) => {
                if (err) {
                  console.log(err);
                  return res.json({
                    success: false,
                    message: err,
                  });
                } else {
                  return res.json({
                    success: true,
                    data: results,
                  });
                }
              });
            } else {
              return res.json({
                success: false,
                message: "Нууц үг буруу байна",
              });
            }
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
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
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        getChooseList((err, results3) => {
          if (err) {
            return res.json({
              success: false,
              message: "Алдаа гарлаа: " + err,
            });
          } else {
            return res.json({
              success: true,
              data: results3,
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
  setUserDaatgal: (req, res) => {
    const token = req.get("authorization");
    const body = req.body;
    if (!token) {
      return res.json({
        success: false,
        message: "Нэвтрэх шаардлагатай!",
      });
    }
    getUserByToken(token, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: false,
          message: "Нэвтрэх шаардлагатай!",
        });
      }
      const permission = results.isFullAdmin;
      if (permission == 1) {
        setDaatgal(body.value, body.id, (err) => {
          if (err) {
            return res.json({
              success: false,
              message: "Алдаа гарлаа: " + err,
            });
          } else {
            return res.json({
              success: true,
              message: "Амжилттай даатгал хийгдлээ.",
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "Эрх байхгүй байна!",
        });
      }
    });
  },
};
