// npm 패키지 require
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const logger = require("./middleware/logger");

// 라우터 require
const movies = require("./routes/movies.js");

// 환경설정 파일 로딩
dotenv.config({ path: "./config/config.env" });
//웹서버 프레임워크인 익스프레스를 가져온다.
const app = express();

// body 사용시 body를 json으로 사용하겠다
app.use(express.json());

// app.use 는 순서가 중요 순서대로 실행을 시킵니다. next로
// 미들웨어 연결
app.use(logger);

app.use(morgan("combined"));
// // morgan 사용
app.use(morgan("dev"));

//라우터 연결 : url의 path와 라우터 user 연결
app.use("/api/v1/movies", movies);

const PORT = process.env.PORT || 5100;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
