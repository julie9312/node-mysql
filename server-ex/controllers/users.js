const connection = require("../db/mysql_connection");
const ErrorResponse = require("../utils/errorResponse");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../db/mysql_connection");
const sendEmail = require("../utils/sendMail");
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
      return;
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
    const message = "welcome";
    try {
      await sendEmail({
        email: "hij6776@naver.com",
        subject: "회원가입",
        message: message,
      });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }

    res.status(200).json({ success: true, token: token });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
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

    let isMatch = await bcrypt.compareSync(passwd, savedPasswd);
    // let isMatch = bcrypt.compareSync(passwd, savedPasswd);

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

// @desc    내정보 가져오기
// @route   GET /api/v1/users
exports.getMyInfo = async (req, res, next) => {
  console.log("내 정보 가져오는 API", req.user);

  res.status(200).json({ success: true, result: req.user });
};

//@desc 로그아웃 api : DB에서 해당 유저의 현재 토큰값을 삭제
//@route POST/ api/v1/users/logout
//@parameters no

exports.logout = async (req, res, next) => {
  //토큰테이블에서, 현재 이 헤더에 있는 토큰으로 , 삭제한다.
  let token = req.user.token;
  let user_id = req.user.id;
  let query = `delete from token where user_id = ${user_id} and token = "${token}`;
  try {
    [result] = await connection.query(query);
    if (result.affectedRows == 1) {
      res.status(200).json({ success: true, result: result });
      return;
    } else {
      res.status(400).json({ success: false });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

//안드로이드 사용하고, 아이폰도 사용하고, 집 컴도 사용
// 이 서비스를 각각의 디바이스 마다 로그인 하여 사용중이었다.
// 전체 디바이스 전부 다 로그아웃 을 시키게 하는 API

//@route POST/ api/v1/users/logoutAll
//@parameters no

exports.logoutAll = async (req, res, next) => {
  //토큰테이블에서, 현재 이 헤더에 있는 토큰으로 , 삭제한다.
  let user_id = req.user.id;
  let query = `delete from token where user_id = ${user_id} `;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, result: result });
    return;
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

//회원탈퇴 : db에서 해당 회원의 유저 테이블 정보 삭제
//=> 유저 정보가 있는 다른 테이블도 정보 삭제.

//@desc 회원탈퇴 : 유저 테이블에서 삭제, 토큰 테이블에서 삭제
//@route DELETE /api/v1/users

exports.deleteUser = async (req, res, next) => {
  let user_id = req.user.id;

  let query = `delete from user where id = ${user_id}`;
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();
    //첫번째 테이블에서 정보 삭제
    [result] = await conn.query(query);
    // 두번째 테이블에서 정보 삭제
    query = `delete from token where user_id = ${user_id}`;

    [result] = await connection.query(query);
    await conn.commit();
    res.status(200).json({ success: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ success: false, error: e });
  } finally {
    conn.release();
  }
};
