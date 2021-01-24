const {
  userReg,
  userLogin,
  productListMini,
  productList,
  chooseList,
} = require("./user.controller");
const router = require("express").Router();

router.post("/user/registration", userReg);
router.post("/user/login", userLogin);
router.get("/user/productListMini", productListMini);
router.get("/user/productList", productList);
router.get("/user/chooseList", chooseList);

module.exports = router;
