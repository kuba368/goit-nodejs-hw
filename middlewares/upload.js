const multer = require("multer");
const config = require("../config/config");

const upload = multer({
  dest: config.UPLOAD_DIR,
});

module.exports = {
  upload,
};
