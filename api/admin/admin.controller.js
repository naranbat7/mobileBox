const {
  getUserByUsername,
  getUserByToken,
  setToken,
  addAdminByBody,
  setUserByToken,
  adminList,
  deleteAdmin,
  setUserById,
} = require("./admin.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

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

      const result = body.password.localeCompare(results.pass);
      if (result == 0) {
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
};
