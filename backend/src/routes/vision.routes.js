const router = require("express").Router();

const upload = require("../middleware/upload.middleware");

const vissionController = require("../controllers/vision.controller");

router.post(
    "/upload",
    upload.single("image"),
    vissionController.uploadSnapshot
);

module.exports = router;