// @desc 모든 정보를 다 조회
// @route GET/ api/vi/bootcamps
// @access Public

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};
// @desc 모든 정보를 다 조회 해당 아이디의 정보조회
// @route GET/ api/vi/bootcamps/id
// @access Public

exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show bootcamp ${req.params.id} 번`,
  });
};

// @desc 새로운 정보를 인서트
// @route POST/ api/vi/bootcamps
// @access Public

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Create new bootcamp",
  });
};

// @desc 기존정보를 업데이트
// @route PUT/ api/vi/bootcamps/id
// @access Public

exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update bootcamp ${req.params.id}`,
  });
};

// @desc 해당정보를 삭제
// @route DELETE/ api/vi/bootcamps/id
// @access Public

exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete bootcamp ${req.params.id}`,
  });
};
