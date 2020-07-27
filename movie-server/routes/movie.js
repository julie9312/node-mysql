const express = require("express");

const {
  getMovies,
  getsearchMovie,
  getMovieByYear,
  getMovieAttendance,
  getsearchMovie,
} = require("../controllers/movie");

const router = express.Router();

router.route("/").get(getMovies);
router.route("/search").get(getsearchMovie);
router.route("/year").get(getMovieByYear);
router.route("/attendance").get(getMovieAttendance);
module.exports = router;
