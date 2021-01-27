const {
  adminLogin,
  loginAdminPanel,
  addAdmin,
  adminInfoByToken,
  setAdmin,
  adminList,
  deleteAdmin,
  setOtherAdmin,
  userList,
  deleteUser,
  changeInsuranceDate,
  setUser,
  uploadImage,
  addProduct,
  deleteProduct,
  productList,
  setProduct,
  uploadImage2,
  userLastLocation,
  chooseList,
  setUserDaatgal,
} = require("./admin.controller");
const router = require("express").Router();

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.id + ".png");
  },
});
const upload = multer({ storage: storage });

router.post("/admin/login", adminLogin);
router.get("/admin/loginAdminPanel", loginAdminPanel);
router.post("/admin/addAdmin", addAdmin);
router.get("/admin/adminInfoByToken", adminInfoByToken);
router.post("/admin/setAdmin", setAdmin);
router.get("/admin/adminList", adminList);
router.post("/admin/deleteAdmin", deleteAdmin);
router.post("/admin/setOtherAdmin", setOtherAdmin);
router.get("/admin/userList", userList);
router.post("/admin/deleteUser", deleteUser);
router.post("/admin/changeInsuranceDate", changeInsuranceDate);
router.post("/admin/setUser", setUser);
router.post("/admin/uploadImage", upload.single("file"), uploadImage);
router.post("/admin/uploadImage2", upload.single("file"), uploadImage2);
router.post("/admin/addProduct", addProduct);
router.post("/admin/deleteProduct", deleteProduct);
router.get("/admin/productList", productList);
router.post("/admin/setProduct", setProduct);
router.post("/admin/userLastLocation", userLastLocation);
router.get("/admin/chooseList", chooseList);
router.post("/admin/setUserDaatgal", setUserDaatgal);

module.exports = router;
