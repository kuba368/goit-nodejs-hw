const express = require("express");

const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");
const { upload } = require("../../middlewares/upload");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/current", auth, authController.current);
router.post("/logout", auth, authController.logout);
router.patch(
  "/avatars",
  auth,
  upload.single("file"),
  authController.updateAvatar
);
router.post("/verify", authController.reverifyEmail);
router.get("/verify/:verificationToken", authController.verifyEmail);

module.exports = router;
