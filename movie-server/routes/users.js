const express = require("express");
const auth = require("../middleware/auth");
const {
  RegisterMovies,
  logout,
  loginMovies,
  userPhotoUpload,
} = require("../controllers/users");

const router = express.Router();

// api/v1/users
router.route("/").post(RegisterMovies);
router.route("/login").post(loginMovies);
router.route("/logout").delete(auth, logout);
router.route("/me/photo").put(auth, userPhotoUpload);

module.exports = router;
