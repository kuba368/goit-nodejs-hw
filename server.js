const mongoose = require("mongoose");
const config = require("./config/config");
const app = require("./app");
const fs = require("node:fs").promises;
require("./config/passport");

const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;

const isAccessible = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const createFolder = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder, {
      recursive: true,
    });
  } else {
    console.log("Directories are already created");
  }
};

mongoose
  .connect(DB_HOST, {
    dbName: "db-contacts",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`App listens on port ${PORT}`);
      createFolder(config.UPLOAD_DIR);
      createFolder(config.AVATARS_PATH);
      createFolder(config.TMP_DIR);
    });
  })
  .catch((error) => {
    console.error(`Error while establishing connection: [${error}]`);
    process.exit(1);
  });
