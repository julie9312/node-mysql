const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const connection = require("../db/mysql_connection");

//@desc 회원가입
//@route POST/api/v1/users
//@parameters email, passwd

exports.RegisterMovies = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  //이메일 체크 (validator)
  if (!validator.isEmail(email)) {
    res.status(400).json();
    return;
  }

  //비밀번호 단방향 암호화
  const hashedPasswd = await bcrypt.hash(passwd, 8);

  //유저인서트
  let query = "insert into movie_user(email, passwd) values ( ? , ? )";
  let data = [email, hashedPasswd];
  let user_id;

  const conn = await connection.getConnection();
  await conn.beginTransaction();

  try {
    [result] = await conn.query(query, data);
    user_id = result.insertId;
  } catch (e) {
    await conn.rollback();
    res.status(500).json();
    return;
  }

  // 토큰 처리  npm jsonwebtoken
  // 토큰 생성 sign
  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = "insert into movie_token(token, user_id) values (? ,?)";
  data = [token, user_id];

  try {
    [result] = await conn.query(query, data);
  } catch (e) {
    await conn.rollback();
    res.status(500).json();
    return;
  }
  await conn.commit();
  await conn.release();

  res.status(200).json({ success: true, token: token });
};

//로그인하는 api 생성
//@desc 로그인
//@route POST/api/v1/users/login
//@parameters email, passwd

exports.loginMovies = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  let query = "select * from movie_user where email = ? ";
  let data = [email];
  let user_id;

  try {
    [rows] = await connection.query(query, data);
    //디비에 저장된 비밀번호 가져와서
    let hashedPasswd = rows[0].passwd;
    user_id = rows[0].id;
    //비밀번호 체크 : 비밀번호가 서로 맞는지 확인
    let isMatch = await bcrypt.compare(passwd, hashedPasswd);

    if (!isMatch) {
      res.status(401).json({ message: "gjgjgj", isMatch: isMatch });
      return;
    }
  } catch (e) {
    res.status(500).json();
    return;
  }

  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = "insert into movie_token (token, user_id) values (?, ?)";
  data = [token, user_id];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, token: token });
  } catch (e) {
    res.status(500).json();
  }
};

// @desc 로그아웃 ( 현재의 기기 1개에 대한 로그아웃)
// @route /api/v1/users/logout

exports.logout = async (req, res, next) => {
  // movie_token 테이블에서, 토큰 삭제해야 로그아웃이 되는것이다.
  let user_id = req.user.id;
  let token = req.user.token;

  let query = "delete from movie_token where user_id = ? and token = ?";
  let data = [user_id, token];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json();
  }
};
// @desc    유저의 프로필 사진 설정하는 API
// @route   PUT /api/v1/users/me/photo
// @request photo
// @response  success

// 클라이언트가 사진을 보낸다. => 서버가 이 사진을 받는다. = >
// 서버가 이사진을 디렉토리에 저장한다. => 이 사진의 파일명을 DB에 저장한다.

exports.userPhotoUpload = async (req, res, next) => {
  let user_id = req.user.user_id;
  if (!user_id || !req.files) {
    res.status(400).json();
    return;
  }
  console.log(req.files);

  const photo = req.files.photo;
  // 지금 받은 파일이, 이미지 파일인지 체크.
  if (photo.mimetype.startsWith("image") == false) {
    res.status(400).json({ message: "이미지 파일이 아닙니다." });
    console.log(e);
    return;
  }
  if (photo.size > process.env.MAX_FILE_SIZE) {
    res.status(400).json({ message: "커요" });
    return;
  }
  //fall.jpg = > photo_3.jpg
  //abc.png => photo_3.png
  photo.name = `photo_${user_id}${path.parse(photo.name).ext}`;
  //저장할 경로 셋팅 : ./public/upload/photo_3.jpg
  let fileUploadPath = `${process.env.FILE_UPLOAD_PATH}/${photo.name}`;

  photo.mv(fileUploadPath, async (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  //db에 이 파일이름을 업데이트 한다.
  let query = `update movie_user set photo_url = ? where id =?`;
  let data = [photo.name, user_id];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(400).json();
  }

  res.status(200).json();
};
