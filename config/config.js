const path = require("node:path");

const getUploadsPath = () => {
  const now = new Date();
  return path.join(
    __dirname,
    "..",
    "uploads",
    now.getFullYear().toString(),
    (now.getMonth() + 1).toString()
  );
};

const getImagesPath = () => {
  return path.join(__dirname, "..", "images");
};
const getTemp = () => {
  return path.join(__dirname, "../", "tmp");
};

module.exports = {
  AVATARS_PATH: getImagesPath(),
  UPLOAD_DIR: getUploadsPath(),
  TMP_DIR: getTemp(),
};
