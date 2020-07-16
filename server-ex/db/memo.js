const request = require("postman-request");
const connection = require("./mysql_connection.js");

const dotenv = require("dotenv");

const mmboot = require("./db/mmboot");

dotenv.config({ path: "./config/config.env" });

const app = express();

const logger = (req, res, next) => {
  req.hello = "Hello world";
  console.log("미들웨어 실행됨.");
  next();
};

app.use(logger);

//라우터 연결 :url의 path와 라우터 파일과 연결
//(아래방식으로 안하면 api가 추후 추가 될 때 유지보수하기 힘듬)
app.use("/api/v1/mmboot", mmboot);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
// 일단 여기
const express = require("express");
const {
  getmemo,
  getmemos,
  creatememo,
  updatememo,
  deletememo,
} = require("../db/mmboot");

const router = express.Router();
console.log("여기까지.");

//각 경로별로 데이터 가져올수 있도록 , router 셋팅
router.route("/").get(getmemo).post(creatememo);
router.route("/:id").get(getmemos).put(updatememo).delete(deletememo);

module.exports = router;

// const baseUrl = 'http://dummy.restapiexample.com'

let path = "/api/v1/mmboot";

request.get({ path, json: true }, function (error, response, body) {
  let array = body.data;

  let query = "insert into memo (id, title, comment) values ? ";
  // ? 에 들어갈 데이터는 [] 로 만들어야 한다.
  let data = [];
  for (let i = 0; i < array.length; i++) {
    data.push([array[i].memo_id, array[i].memo_title, array[i].memo_comment]);
  }
  console.log(data);
  // 아래 [data] 의 뜻은, 첫번째 물음표? 가 data라는 뜻이다.
  connection.query(query, [data], function (error, results, fields) {});
  connection.end();
});
