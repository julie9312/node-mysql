const express = require("express");
const auth = require("../middleware/auth");

const { addReply, getReply } = require("../controllers/reply");

const router = express.Router();

// api/v1/reply
router.route("/").post(addReply).get(getReply);

module.exports = router;
