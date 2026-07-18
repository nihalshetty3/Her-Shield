const router = require("express").Router();

const { triggerSOS } = require("../controllers/sos.controller");

// Temporary debug (optional)
const controller = require("../controllers/sos.controller");
console.log(controller);

router.post("/trigger", triggerSOS);

module.exports = router;