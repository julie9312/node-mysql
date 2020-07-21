const connection = require("../db/mysql_connection");
const ErrorResponse = require("../utils/errorResponse");
const validator = require("validator");

//@desc 회원가입
//@route POST/api/v1/users    => 나
//@route POST/api/v1/users/register
//@route POST/api/v1/users/signup
//@parameters email,passwd

exports.createUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  // 이메일이 정상적인가 체크(validator)
  if (!validator.isEmail(email)) {
    res.status(200).json({ success: false });
    return;
  }
  //이메일 중복체크
  let query = "select * from user where email = ?";
  let data = [email];
  try {
    [rows] = await connection.query(query, data);
    if (rows.length >= 1) {
      res
        .status(200)
        .json({ success: false, code: 1, message: "이미 존재하는 이메일" });
      return;
    }
  } catch {
    res.status(500).json({ success: false, error: e });
    return;
  }

  //
  query = "insert into user(email, passwd) values ?";
  data = [email, passwd];
  try {
    [result] = await connection.query(query, [[data]]);
    res.status(200).json({ success: true, result: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
