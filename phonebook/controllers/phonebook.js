const connection = require("../db/mysql_connection");
//모든 주소록 데이터를 다 가져와서, 클라이언트 한테 보내는것음
//문제가 있습니다. 데이터를 모두 다 보내지 않고, 끊어서 보내야함.
//현업에서는 20~30개 사이로 끊어서 보냅니다.

//@desc 모든 주소록 가져오기
//@route GET/api/v1/phonebooks?offset=0&limit=20

exports.getAllPhonebooks = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;

  let query = `select * from phonebook limit ${offset}, ${limit}`;
  try {
    [rows, fileds] = await connection.query(query);
    let count = rows.length;
    res.status(200).json({ success: true, items: rows, count: count });
  } catch (e) {
    res.status(500).json({ success: false, massage: "에러났어욤", error: e });
  }
};

//@desc 주소록 1개 추가하기
//@route POST/api/v1/phonebook

exports.createPhonebook = async (req, res, next) => {
  let name = req.body.name;
  let phone = req.body.phone;

  let query = "insert into phonebook(name, phone) values ?";
  let data = [name, phone];

  try {
    [result] = await connection.query(query, [[data]]);
    res.status(200).json({ success: true, result: result });
  } catch (e) {
    res.status(500).json({ success: false, massage: "db에러", error: e });
  }
};

//@desc 주소록 1개 수정하기
//@route PUT/api/v1/phonebook
//@parameters id, name, phone
exports.updatePhonebook = async (req, res, next) => {
  let id = req.body.id;
  let name = req.body.name;
  let phone = req.body.phone;

  let query = "update phonebook set name = ? , phone =? where id = ?";
  let data = [name, phone, id];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, result: result });
  } catch (e) {
    res.status(500).json({ success: false, massage: "db에러", error: e });
  }
};

//@desc 주소록 1개 삭제하기
//@route DELETE/api/v1/phonebook
//@paramters id
exports.deletePhonebook = async (req, res, next) => {
  let id = req.body.id;

  let query = "delete from phonebook where id = ?";
  let data = [id];
  try {
    [result] = await connection.query(query, data);
    res.status(200).json({ success: true, result: result });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, massage: "에러났어욤", error: e });
  }
};

// @desc 이름이나, 전화번호 검색하는 API
// @route GET/api/v1/phonebook/search?keyword=67
// @route GET/api/v1/phonebook/search?keyword=길동

exports.searchPhonebook = async (req, res, next) => {
  let keyword = req.query.keyword;
  let query = `select * from phonebook where name like "%${keyword}%" or phone like "%${keyword}%" `;
  try {
    [rows, fields] = await connection.query(query);
    res.status(200).json({ success: true, items: rows });
  } catch (e) {
    res.status(500).json({ success: false, massage: "에러났어욤", error: e });
  }
};
