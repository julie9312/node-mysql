const express = require("express");
const auth = require("../middleware/auth");
const {
  createUser,
  loginUser,
  changePasswd,
  getMyInfo,
  logout,
  logoutAll,
  deleteUser,
  forgotPasswd,
  resetPasswd,
} = require("../controllers/users");

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(auth, getMyInfo)
  .delete(auth, deleteUser);
router.route("/login").post(loginUser);
router.route("/change").post(changePasswd);
router.route("/logout").post(auth, logout);
router.route("/logoutAll").post(auth, logoutAll);
router.route("/forgotPasswd").post(auth, forgotPasswd);
router.route("/resetPasswd/:resetPasswdToken").post(auth, resetPasswd);

module.exports = router;
