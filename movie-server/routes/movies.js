const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

const {
  getMovies,
  searchMovies,
  getMoviesByYear,
  getMoviesByAttnd,
  RegisterMovies,
  loginMovies,
  deleteMovieUser,
  changePasswd,
  forgotPasswd,
  resetPasswd,
} = require("../controllers/movies.js");

router.route("/").get(getMovies).delete(auth, deleteMovieUser);
router.route("/search").get(searchMovies);
router.route("/year").get(getMoviesByYear);
router.route("/attnd").get(getMoviesByAttnd);
router.route("/register").post(RegisterMovies);
router.route("/login").post(loginMovies);
router.route("/change").post(changePasswd);
router.route("/forgotPasswd").post(auth, forgotPasswd);
router.route("/resetPasswd/:resetPasswdToken").post(auth, resetPasswd);

module.exports = router;
