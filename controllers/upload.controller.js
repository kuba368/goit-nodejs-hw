const path = require("node:path");
const fs = require("node:fs").promises;
const config = require("../config/config");

const uploadFile = async (req, res, next) => {
  const { description } = req.body;
  const { path: temporaryName, originalname } = req.file;
  const filename = path.join(config.AVATARS_PATH, originalname);
  fs.rename(temporaryName, filename).then(() => {
    return res
      .json({
        description,
        message: "File uploaded successfully",
        status: 200,
      })
      .catch((error) => {
        fs.unlink(temporaryName)
          .then(() => {
            console.log("Error encoutered, file deleted");
            next(error);
          })
          .catch((error) => {
            console.log(error);
            next(error);
          });
      });
  });
};

module.exports = {
  uploadFile,
};
