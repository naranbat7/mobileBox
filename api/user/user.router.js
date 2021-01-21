const { userReg, userLogin } = require("./user.controller");
const router = require("express").Router();

router.post("/user/registration", userReg);
router.post("/user/login", userLogin);

module.exports = router;
