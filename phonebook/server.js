const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const app = express();
//api 경로 연결
app.use("/api/v1/phonebooks", phonebooks);

const PORT = process.env.PORT || 5300;
app.listen(PORT, console.log("API SERVER"));

// const morgan = require("morgan");

// const logger = require("./middleware/logger");
// const errorHandler = require("./middleware/error");
