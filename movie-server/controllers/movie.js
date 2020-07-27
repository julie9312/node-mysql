const connection = require("../db/mysql_connection");

//@desc 영화 데이터 불러오기
//url    GET/api/v1/movies?offset=0&limit=25
//@request
//@response success, items / id, titile, attendance , year / cnt

exports.getMovies = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;

  let query = `select * from movie limit ${offset}, ${limit}`;
  try {
    [rows, fileds] = await connection.query(query);
    res.status(200).json({ success: true, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, massage: "에러났어요", error: e });
  }
};

//@desc 영화명 검색해서 가져오기
//url GET/api/v1/movie/search?offset=0&limit=25&keyword=?
//@request offset / limit
//@response success, items[], cnt

exports.getsearchMovie = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;
  let keyword = req.query.keyword;
  let query = `select * from movie where title like "%${keyword}%" ,limit ${offset},${limit}`;
  try {
    [rows, fields] = await connection.query(query);
    res.status(200).json({ success: true, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, massage: "에러났어요", error: e });
  }
};

//@desc 연도 내림차순 정렬해서 가져오기
//url
//@request offset / limit /desc
//@response success, items[], cnt

exports.getMovieByYear = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;
  let order = req.query.order;

  let query = `select * from movie order by"${order}" year desc limit ${offset}, ${limit}`;

  try {
    [rows, fields] = await connection.query(query);
    res.status(200).json({ success: true, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, massage: "에러났어요", error: e });
  }
};

//@desc 관객수 내림차순 정렬해서 가져오기
//url api/v1/movie/attendance
//@request offset/ limit/ order by
//@response success, items[], cnt

exports.getMovieAttendance = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;

  let query = `select * from movie order by attendance desc limit ${offset}, ${limit}`;

  try {
    [rows, fields] = await connection.query(query);
    res.status(200).json({ success: true, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, massage: "에러났어요", error: e });
  }
};
