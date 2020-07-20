const express = require("express");
const router = express.Router();

//모든 주소록 가져오는 api
router.get("/", (req, res) => {
  res.status(200).json({ result: "ok" });
});
//연락처 추가
router.post("/", (req, res) => {
  res.status(200).json({ result: "ok" });
});
//연럭처수정
router.put("/", (req, res) => {
  res.status(200).json({ result: "ok" });
});
//연락처삭제
router.delete("/", (req, res) => {
  res.status(200).json({ result: "ok" });
});

module.exports = router;
