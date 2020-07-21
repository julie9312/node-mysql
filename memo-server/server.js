const express = require("express");
const dotenv = require("dotenv");
const memos = require("./routes/memos");

dotenv.config({ path: "./config/config.env" });

const app = express();

//post 사용시, body부분을 json으로 사용하겠다.
app.use(express.json());
app.use("/api/v1/memos", memos);

const PORT = process.env.PORT || 5100;

app.listen(PORT, console.log("App listening on port 5100!"));