// 데이터베이스 처리 위한 라이브러리 필요
const connection = require("../db/mysql_connection");
//@desc 댓글추가
//@route POST/api/reply
//@request movie_id, content, rating

exports.addReply = async (req, res, next) => {
  let movie_id = req.body.movie_id;
  let user_id = req.user.user_id;
  let content = req.body.content;
  let rating = req.body.rating;

  let query = `insert into movie_reply (movie_id, user_id, content, rating) values (?,?,?,?)`;
  let data = [movie_id, user_id, content, rating];

  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json();
  }
};

//@desc 해당 영화의 댓글을 가져오는 api
//@route GET/api/v1/reply?movie_id=124&offser=0&limit=25
//@request movie_id, offset, limit
//@response success, items : [], cnt

exports.getReply = async (req, res, next) => {
  let movie_id = req.query.movie_id;
  let offset = req.query.offset;
  let limit = req.query.limit;

  let query = `select r.id as reply_id, m.title, u.email, r.content, r.rating, r.created_at 
    from movie_reply as r
    join movie as m 
    on r.user_id = m.id
    join movie_user as u 
    on r.user_id = u.id
    where r.movie_id = ? limit ?,?; `;

  let data = [movie_id, Number(offset), Number(limit)];

  try {
    [rows] = await connection.query(query, data);
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
  } catch (e) {
    res.status(500).json();
  }
};
