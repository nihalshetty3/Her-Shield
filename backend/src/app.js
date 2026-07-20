const express = require("express");
const cors = require("cors");
const sosRoutes = require("./routes/sos.routes");
const audioRoutes=require("./routes/audio.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/dashboard", dashboardRoutes);

app.get("/" , (req, res) => {
    res.json({
        success: true,
        message: "Backend running"
    });
});
app.use("/api/sos", sosRoutes);
app.use("/api/audio",audioRoutes);
app.use("/api/vision", require("./routes/vision/routes"));

module.exports = app;