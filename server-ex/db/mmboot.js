// @desc 모든 정보를 다 조회
// @route GET/ api/vi/memo
// @access Public

exports.getmemo = (req, res, next) => {
  res.status(200).json({ success: true, msg: "memo select" });
};
// @desc 모든 정보를 다 조회 해당 아이디의 정보조회
// @route GET/ api/vi/memo/id
// @access Public

exports.getmemos = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `memo select2 ${req.params.id} 번`,
  });
};

// @desc 새로운 정보를 인서트
// @route POST/ api/vi/memo
// @access Public

exports.creatememo = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Create new memo",
  });
};

// @desc 기존정보를 업데이트
// @route PUT/ api/vi/memo/id
// @access Public

exports.updatememo = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update memo ${req.params.id}`,
  });
};

// @desc 해당정보를 삭제
// @route DELETE/ api/vi/memo/id
// @access Public

exports.deletememo = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete memo ${req.params.id}`,
  });
};
