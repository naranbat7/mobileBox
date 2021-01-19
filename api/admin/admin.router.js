const {
  adminLogin,
  loginAdminPanel,
  addAdmin,
  adminInfoByToken,
  setAdmin,
  adminList,
  deleteAdmin,
  setOtherAdmin,
} = require("./admin.controller");
const router = require("express").Router();
const {
  checkUserToken,
  checkAdminToken,
} = require("../../auth/token_validation");

router.post("/login", adminLogin);
router.get("/loginAdminPanel", loginAdminPanel);
router.post("/addAdmin", addAdmin);
router.get("/adminInfoByToken", adminInfoByToken);
router.post("/setAdmin", setAdmin);
router.get("/adminList", adminList);
router.post("/deleteAdmin", deleteAdmin);
router.post("/setOtherAdmin", setOtherAdmin);

module.exports = router;
