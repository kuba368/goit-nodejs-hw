const express = require("express");
const router = express.Router();
const uploadController = require("../../controllers/upload.controller");
const { upload } = require("../../middlewares/upload");

router.post("/upload", upload.single("file"), uploadController.uploadFile);

module.exports = router;
