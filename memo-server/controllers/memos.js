//데이터베이스 연결
const connection = require("../db/mysql_connection");

// @desc 모든 정보를 다 조회
// @route GET/ api/vi/memos

exports.getMemos = function (req, res, next) {
  //1.데이터베이스에 접속해서, 쿼리한다.
  //2. 그 결과를 res 에 담아서 보내준다.
  let query = "select * from memo;";

  connection.query(query, function (error, results, fields) {
    console.log(results);
    res.status(200).json({
      success: true,
      results: {
        items: results,
      },
    });
  });
  connection.end();
};

// @desc 메모생성하기
// @route POST/api/v1/memos
// @body {id:3, title:"안녕", comment:"좋다"}

exports.createMemo = (req, res, next) => {
  let title = req.body.title;
  let comment = req.body.comment;
  let query = "insert into memo (title, comment) values (? , ?)";
  connection.query(query, [title, comment], function (error, results, fields) {
    console.log(results);
    res.status(200).json({ success: true });
  });
};

// @desc 메모수정하기 (query 위랑 다른 방식으로 )
// @route PUT/api/v1/memos
// @body {id:3, title:"안녕", comment:"좋다"}
exports.updateMemo = function (req, res, next) {
  let id = req.params.id;
  let title = req.body.title;
  let comment = req.body.comment;
  let query = `update memo 
               set title = "${title}",
               comment = "${comment}"
               where id = ${id} `;

  let query2 = "update memo set title = ?, comment = ? where id = ?";
  connection.query(query2, [title, comment, id], function (
    error,
    results,
    fields
  ) {
    console.log(results);
    res.status(200).json({ success: true });
    connection.end();
  });
};
// @desc 메모삭제하기
// @route DELETE/api/v1/memos/:id
// @body {id:3, title:"안녕", comment:"좋다"}

exports.deleteMemo = (req, res, next) => {
  let id = req.params.id;

  let query = `delete from memo where id = ${id} `;

  connection.query(query, function (error, results, fields) {
    console.log(results);
    res.status(200).json({ success: true });
    connection.end();
  });
};
