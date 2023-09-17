const express = require("express");

const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");
const { upload } = require("../../middlewares/upload");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.patch(
  "/avatars",
  auth,
  upload.single("file"),
  authController.updateAvatar
);

module.exports = router;
