const express = require("express");
const {
  getMovies,
  searchMovies,
  getMoviesByYear,
  getMovieByAttendance,
} = require("../controllers/movies");

const router = express.Router();

// localhost:5100api/v1/movies
router.route("/").get(getMovies);
router.route("/search").get(searchMovies);
router.route("/year").get(getMoviesByYear);
router.route("/attendance").get(getMovieByAttendance);

module.exports = router;
