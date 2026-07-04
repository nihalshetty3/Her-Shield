const router = require("express").Router();
const {triggerSOS} = require("../controllers/sos.controller");

router.post("/trigger", triggerSOS);
module.exports = router;

