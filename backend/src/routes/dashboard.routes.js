const router = require("express").Router();

const {
    getIncidents
} = require("../controllers/dashboard.controller");

router.get("/incidents" , getIncidents);
module.exports = router;