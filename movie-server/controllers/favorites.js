// 데이터베이스 처리 위한 라이브러리 필요
const connection = require("../db/mysql_connection");

//@desc 좋아하는 영화 추가
//@route POST/api/v1/favorites
//@parameters movie_id

exports.addFavorite = async (req, res, next) => {
  let movie_id = req.body.movie_id;
  let user_id = req.user.user_id;

  let query = `insert into favorite_movie (movie_id, user_id) values (${movie_id},${user_id})`;
  console.log(query);

  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    if (e.errno == 1062) {
      res.status(500).json({ message: "이미 즐겨찾기에 추가 되었습니다" });
    } else {
      console.log(e);
      res.status(500).json();
    }
  }
};

// @desc 즐겨찾기 저장된 영화 가져오는 api
// @route GET/api/v1/favorites?offset=0&limit=25
// @req offset, limit
// @res  success, cnt, items : [{title, genre, attendance, year}]

exports.getMyFavorites = async (req, res, next) => {
  let offset = Number(req.query.offset);
  let limit = Number(req.query.limit);
  let user_id = req.user.user_id;

  let query =
    "select m.id, m.title, m.genre, m.attendance, m.year \
      from favorite_movie as f \
      join movie as m \
      on f.movie_id = m.id \
      where f.user_id = ? \
      limit ? , ? ;";

  let data = [user_id, offset, limit];

  try {
    [rows] = await connection.query(query, data);
    let cnt = rows.length;
    res.status(200).json({ success: true, items: rows, cnt: cnt });
  } catch (e) {
    res.status(500).json();
  }
};
// @desc 즐겨찾기 삭제
// @route DELETE /api/v1/favorites
// @request favorite_id

exports.deleteFavorite = async (req, res, next) => {
  let favorite_id = req.body.favorite_id;
  if (!favorite_id) {
    res.status(400).json();
    return;
  }

  let query = "delete from favorite_movie where id = ?";
  let data = [favorite_id];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json();
  }
};
