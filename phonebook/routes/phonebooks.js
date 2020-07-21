const express = require("express");

const {
  getAllPhonebooks,
  createPhonebook,
  updatePhonebook,
  deletePhonebook,
  searchPhonebook,
} = require("../controllers/phonebook");

const router = express.Router();

router
  .route("/")
  .get(getAllPhonebooks)
  .post(createPhonebook)
  .put(updatePhonebook)
  .delete(deletePhonebook);
router.route("/search").get(searchPhonebook);

module.exports = router;
