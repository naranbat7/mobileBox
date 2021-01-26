const {
  userReg,
  userLogin,
  productListMini,
  productList,
  chooseList,
  getPayment,
  paymentCallback,
  checkDaatgal,
  codeAgain,
  addLocation,
} = require("./user.controller");
const router = require("express").Router();

router.post("/user/registration", userReg);
router.post("/user/login", userLogin);
router.get("/user/productListMini", productListMini);
router.get("/user/productList", productList);
router.get("/user/chooseList", chooseList);
router.get("/user/payment/:id", getPayment);
router.get("/user/paymentCallback/:id", paymentCallback);
router.get("/user/checkDaatgal", checkDaatgal);
router.get("/user/codeAgain", codeAgain);
router.post("/user/addLocation", addLocation);

module.exports = router;
