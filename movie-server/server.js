// npm 패키지 require
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// 파일 처리를 위한 라이브러리 임포트
const fileupload = require("express-fileupload");
const path = require("path");

const logger = require("./middleware/logger");

// 라우터 require
const movies = require("./routes/movies");
const users = require("./routes/users");
const favorites = require("./routes/favorites");
const reply = require("./routes/reply");
const reservations = require("./routes/reservations");

// 환경설정 파일 로딩
dotenv.config({ path: "./config/config.env" });
//웹서버 프레임워크인 익스프레스를 가져온다.
const app = express();

// body 사용시 body를 json으로 사용하겠다
app.use(express.json());
app.use(fileupload());
//이미지를 불러올 수 있도록 static 경로 설정
app.use(express.static(path.join(__dirname, "public")));

// app.use 는 순서가 중요 순서대로 실행을 시킵니다. next로
// 미들웨어 연결
app.use(logger);

app.use(morgan("combined"));
// // morgan 사용
app.use(morgan("dev"));

//라우터 연결 : url의 path와 라우터 user 연결
app.use("/api/v1/movies", movies);
app.use("/api/v1/users", users);
app.use("/api/v1/favorites", favorites);
app.use("/api/v1/reply", reply);
app.use("/api/v1/reservations", reservations);

const PORT = process.env.PORT || 5100;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
