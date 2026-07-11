const express = require("express");
const cors = require("cors");
const sosRoutes = require("./routes/sos.routes");
const audioRoutes=require("./routes/audio.routes");

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
app.use("/api/audio",audioRoutes);


module.exports = app;