const express = require("express");
const cors = require("cors");
const sosRoutes = require("./routes/sos.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/" , (req, res) => {
    res.json({
        success: true,
        message: "Backend running"
    });
});
app.use("/api/sos", sosRoutes);

module.exports = app;