const express = require("express");
const dotenv = require("dotenv");
//로그 찍어주는 로그다. 미들웨어다. app.use에 추가시키는것.
const morgan = require("morgan");

const phonebooks = require("./routes/phonebooks");

dotenv.config({ path: "./config/config.env" });

const app = express();
//Body parser 설정. 클라이언트에서 body로 데이터 보내는것 처리
app.use(express.json());

// 먼저로그 찍어주도록 미들웨어 설정
app.use(morgan("common"));

//api 경로 연결
app.use("/api/v1/phonebooks", phonebooks);
app.use("/api/v1/phonebook", phonebooks);

const PORT = process.env.PORT || 5300;
app.listen(PORT, console.log("API SERVER"));

// const logger = require("./middleware/logger");
// const errorHandler = require("./middleware/error");
