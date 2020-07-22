const connection = require("../db/mysql_connection");
const ErrorResponse = require("../utils/errorResponse");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../db/mysql_connection");
//@desc 회원가입
//@route POST/api/v1/users    => 나
//@route POST/api/v1/users/register
//@route POST/api/v1/users/signup
//@parameters email,passwd

exports.createUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  // 비밀번호와 같은 것은, 단방향 암호화를 해야 한다.
  // 그래야, 복호화가 안되어서, 안전하다.
  //1234(원문) => dfsdhfoasdhfoi 암호화
  //dfsdhfoasdhfoi => 1234(원문) 복호화

  const hashedPasswd = await bcrypt.hash(passwd, 8);

  // 이메일이 정상적인가 체크(validator)
  if (!validator.isEmail(email)) {
    res.status(500).json({ success: false });
    return;
  }
  //유저인서트
  let query = "insert into user(email, passwd) values ?";
  let data = [email, hashedPasswd];
  let user_id;

  try {
    [result] = await connection.query(query, [[data]]);
    user_id = result.insertId;
  } catch (e) {
    if (e.errno == 1062) {
      //이메일 중복된것이다.
      res.status(400).json({ success: false, errno: 1, message: "이메일중복" });
    } else {
      res.status(500).json({ success: false, error: e });
      return;
    }
  }
  let token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = "insert into token(token, user_id) values (? ,?)";
  data = [token, user_id];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, token: token });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
    return;
  }
};

//로그인하는 api 생성
//@desc 로그인
//@route POST/api/v1/users/login
//@parameters email, passwd

exports.loginUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  let query = "select * from user where email = ? ";
  let data = [email];

  try {
    [rows] = await connection.query(query, data);
    //디비에 저장된 비밀번호 가져와서
    let savedPasswd = rows[0].passwd;
    //비밀번호 체크 : 비밀번호가 서로 맞는지 확인
    let isMatch = await bcrypt.compare(passwd, savedPasswd);

    // let isMatch = bcrypt.compareSync(passwd, savedPasswd);(이것도 활용가능하다)
    if (isMatch == false) {
      res.status(400).json({ success: false, result: isMatch });
      return;
    }
    let token = jwt.sign(
      { user_id: rows[0].id },
      process.env.ACCESS_TOKEN_SECRET
    );

    query = "insert into token (token, user_id) values (?, ?)";
    data = [token, rows[0].id];

    try {
      [result] = await connection.query(query, data);
      res.status(200).json({ success: true, result: isMatch, token: token });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

//@desc 패스워드 변경
//@route POST/api/v1/users/login
//@parameters email, passwd email, passwd, new_passwd

exports.changePasswd = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  let new_passwd = req.body.new_passwd;

  // 이 유저가, 맞는 유저인지 체크
  let query = "select passwd from user where email = ? ";
  let data = [email];

  try {
    [rows] = await connection.query(query, data);
    let savedPasswd = rows[0].passwd;

    let isMatch = bcrypt.compareSync(passwd, savedPasswd);
    if (isMatch != true) {
      res.status(401).json({ success: false, result: isMatch });
      return;
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
  query = "update user set passwd = ? where email = ? ";

  const hashedPasswd = await bcrypt.hash(new_passwd, 8);

  data = [hashedPasswd, email];

  try {
    [result] = await connection.query(query, data);
    if (result.affectedRows == 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

//@desc 내정보 가져오기
//@route GET/api/users/:id

exports.getMyInfo = async (req, res, next) => {
  let id = req.params.id;

  let query = `select * from user where id = ${id}`;
  try {
    [rows] = await connection.query(query);
    if (rows.length != 1) {
      res.status(400).json({ success: false });
    } else {
      delete rows[0].passwd;
      res.status(200).json({ success: true, result: rows[0] });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
