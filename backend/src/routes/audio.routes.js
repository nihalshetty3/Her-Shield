const express = require("express");
const multer = require("multer");

const {
    analyzeAudio
} = require("../controllers/audio.controller");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/analyze",
    upload.single("audio"),
    analyzeAudio
);

module.exports = router;