const connection = require("../db/mysql_connection.js");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { query } = require("../db/mysql_connection");
const sendEmail = require("../utils/sendMail");

// @desc    영화 데이터 불러오기
// @url     GET /api/v1/movies
// @request offset, limit (?offset=0&limit=25)
// @response success, error, items : [{ id, title, genre, attendance, year }, cnt]
exports.getMovies = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;

  if (!offset || !limit) {
    res.status(400).json({ message: "파라미터 셋팅 에러" });
    return;
  }

  let query = `select * from movie limit ${offset}, ${limit}`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc    영화명 검색해서 가져오기
// @url     GET /api/v1/movies/search
// @request keyword, offset, limit (?offset=0&limit=25&keyword=war)
// @response success, error, items : [{ id, title, genre, attendance, year }, cnt]
exports.searchMovies = async (req, res, next) => {
  let keyword = req.query.keyword;
  let offset = req.query.offset;
  let limit = req.query.limit;

  if (!offset || !limit) {
    res.status(400).json({ message: "파라미터 셋팅 에러" });
    return;
  }

  if (!keyword) {
    keyword = "";
  }

  let query = `select * from movie where title like '%${keyword}%' limit ${offset}, ${limit};`;
  console.log(query);

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc    연도 정렬해서 가져오기
// @url     GET /api/v1/movies/year
// @request offset, limit, order : asc / desc (디폴트 오름차순), keyword
//          (?offset=0&limit=25&order=0&keyword=war)
// @response success, error, items : [{ id, title, genre, attendance, year }, cnt]
exports.getMoviesByYear = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;
  let order = req.query.order;
  let keyword = req.query.keyword;

  if (!offset || !limit) {
    res.status(400).json({ message: "파라미터 셋팅 에러" });
    return;
  }

  if (!order || order == 0) {
    order = "asc";
  } else if (order == 1) {
    order = "desc";
  }

  if (!keyword) {
    keyword = "";
  }

  let query = `select * from movie where title like '%${keyword}%' order by year ${order} limit ${offset}, ${limit}`;
  console.log(query);

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc    관객수 정렬해서 가져오기
// @url     GET /api/v1/movies/attnd
// @request offset, limit, order : asc / desc (디폴트 오름차순), keyword
//          (&offset=0&limit=25&order=0&keyword=war)
// @response success, error, items : [{ id, title, genre, attendance, year }, cnt]
exports.getMoviesByAttnd = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;
  let order = req.query.order;
  let keyword = req.query.keyword;

  if (!offset || !limit) {
    res.status(400).json({ message: "파라미터 셋팅 에러" });
    return;
  }

  if (!order || order == 1) {
    order = "desc";
  } else if (order == 0) {
    order = "asc";
  }

  if (!keyword) {
    keyword = "";
  }

  query = `select * from movie where title like '%${keyword}%' order by attendance ${order} limit ${offset}, ${limit}`;
  console.log(query);

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

//@desc 회원가입
//@route POST/api/v1/movies/register
//@parameters email, passwd

exports.RegisterMovies = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  //비밀번호 단방향 암호화
  const hashedPasswd = await bcrypt.hash(passwd, 8);

  //이메일 체크 (validator)
  if (!validator.isEmail(email)) {
    res.status(500).json({ success: false });
    return;
  }

  //유저인서트
  let query = "insert into movie_user(email, passwd) values ? ";
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
  query = "insert into movie_token(token, user_id) values (? ,?)";
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
//@route POST/api/v1/movies/login
//@parameters email, passwd

exports.loginMovies = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  let query = "select * from movie_user where email = ? ";
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

    query = "insert into movie_token (token, user_id) values (?, ?)";
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

//회원탈퇴 : db에서 해당 회원의 유저 테이블 정보 삭제
//=> 유저 정보가 있는 다른 테이블도 정보 삭제.

//@desc 회원탈퇴 : 유저 테이블에서 삭제, 토큰 테이블에서 삭제
//@route DELETE /api/v1/movieuser

exports.deleteMovieUser = async (req, res, next) => {
  let user_id = req.user.id;

  let query = `delete from movie_user where id = ${user_id}`;
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();
    //첫번째 테이블에서 정보 삭제
    [result] = await conn.query(query);
    // 두번째 테이블에서 정보 삭제
    query = `delete from movie_token where user_id = ${user_id}`;

    [result] = await connection.query(query);
    await conn.commit();
    res.status(200).json({ success: true });
    console.log("gogogogo");
    return;
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ success: false, error: e });
  } finally {
    conn.release();
  }
};

//@desc 패스워드 변경
//@route POST/api/v1/movies/login
//@parameters email, passwd email, passwd, new_passwd

exports.changePasswd = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  let new_passwd = req.body.new_passwd;

  // 이 유저가, 맞는 유저인지 체크
  let query = "select passwd from movie_user where email = ? ";
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
  query = "update movie_user set passwd = ? where email = ? ";

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

//유저가 패스워드를 분실

//1. 클라이언트가 패스워드 분실했다고 서버한테 요청
//서버가 패스워드를 변경할수 있는url 을 클라이언트한테 보내준다.
//(경로에 암호화된 문자열을 보내줍니다. - 토큰역할)

// @desc 패스워드 분실
//@route POST/ api/v1/movies/forgotPasswd

exports.forgotPasswd = async (req, res, next) => {
  let user = req.user;
  //암호회된 문자열 만드는 방법
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswdToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //유저테이블에, reset_passwd_token 컬럼에 저장
  let query = "update movie_user set reset_passwd_token = ? where id = ?";
  let data = [resetPasswdToken, user.id];

  try {
    [result] = await connection.query(query, data);
    user.reset_passwd_token = resetPasswdToken;
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

//2.클라이언트는 해당 암호화된 주소를 받아서, 새로운 비밀번호를 함께 서버로 보냅니다.
//서버는 , 이 주소가 진짜 유효한지 확인해서 새로운 비밀번호로 셋팅

//@desc 리셋 패스워드 토큰을, 경로로 만들어서 , 바꿀 비번과 함께 요청
//비번초기화 (reset passwd api)
//@route POST/api/v1/movies/resetPasswd/:resetPasswdToken
//@req pssswd

exports.resetPasswd = async (req, res, next) => {
  const resetPasswdToken = req.params.resetPasswdToken;
  const user_id = req.user.id;

  let query = "select * from movie_user where id = ?";
  let data = [user_id];

  try {
    [rows] = await connection.query(query, data);
    savedResetPasswdToken = rows[0].reset_passwd_token;
    if (savedResetPasswdToken === resetPasswdToken) {
      res.status(400).json({ success: false });
      return;
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
    return;
  }
  let passwd = req.body.passwd;
  const hashedPasswd = await bcrypt.hash(passwd, 8);
  query =
    "update movie_user set passwd = ?, reset_passwd_token = '' where id = ? ";
  data = [hashedPasswd, user_id];
  delete req.user.reset_passwd_token;

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, data: req.user });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};
