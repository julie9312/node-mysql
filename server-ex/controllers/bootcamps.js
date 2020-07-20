const connection = require("../db/mysql_connection");
const ErrorResponse = require("../utils/errorResponse");

// @desc 모든 정보를 다 조회
// @route GET/ api/vi/bootcamps
// @access Public

exports.getBootcamps = async (req, res, next) => {
  try {
    const [rows, fields] = await connection.query("select * from bootcamp");
    res.status(200).json({ success: true, items: rows });
  } catch (e) {
    next(new ErrorResponse("부트캠프 전부 가져오는데 에러 발생", 400));
  }
};
// @desc 해당 아이디의 정보조회
// @route GET/ api/vi/bootcamps/id
// @access Public

exports.getBootcamp = async (req, res, next) => {
  try {
    const [rows, fields] = await connection.query(
      `select * from bootcamp where id = ${req.params.id}`
    );
    if (rows.length != 0) {
      res.status(200).json({ success: true, item: rows[0] });
    } else {
      return next(new ErrorResponse("아이디값 잘못 보냈음,400"));
    }
  } catch (e) {
    next(new ErrorResponse("부트캠프 가져오는데 DB 에러 발생", 500));
  }
};

// @desc 새로운 정보를 인서트
// @route POST/ api/vi/bootcamps
// @access Public

exports.createBootcamp = async (req, res, next) => {
  let title = req.body.title;
  let subject = req.body.subject;
  let teacher = req.body.teacher;
  let start_time = req.body.start_time;

  let query =
    "insert into bootcamp \
  (title, subject, teacher, start_time) values ?";
  let data = [title, subject, teacher, start_time];

  try {
    [rows, filed] = await connection.query(query, [[data]]);
    res.status(200).json({ success: true, user_id: rows.insertId });
    console.log(rows.insertId);
  } catch (e) {
    next(new ErrorResponse("새로운 정보 추가하는데 에러 발생", 500));
  }
};

// @desc 기존정보를 업데이트
// @route PUT/ api/vi/bootcamps/id
// @access Public

exports.updateBootcamp = async (req, res, next) => {
  let id = req.params.id;
  let title = req.body.title;
  let subject = req.body.subject;
  let teacher = req.body.teacher;
  let start_time = req.body.start_time;

  let query =
    "update bootcamp set title = ? , subject = ? ,\
  teacher = ? , start_time = ? where id = ? ";
  let data = [title, subject, teacher, start_time, id];
  try {
    [rows, fields] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    next(new ErrorResponse("부트캠프 가져오는데 DB 에러 발생", 500));
  }
};

// @desc 해당정보를 삭제
// @route DELETE/ api/vi/bootcamps/id
// @access Public

exports.deleteBootcamp = async (req, res, next) => {
  let id = req.params.id;
  let query = `delete from bootcamp where id = ${id} `;
  try {
    [result] = await connection.query(query);
    if (result.affectedRows == 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (e) {
    next(new ErrorResponse("부트캠프 가져오는데 DB 에러 발생", 500));
  }
};
