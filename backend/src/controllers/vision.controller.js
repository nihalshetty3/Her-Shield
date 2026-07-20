const visionService = require("../services/vision.service");

exports.uploadSnapshot = async (req , res) => {
    try{
        const incidentId = req.body.incidentId;

        const imagePath = req.file.path;

        const result = 
            await visionService.analyzeSnapshot(
                incidentId,
                imagePath
            );
            res.json(result);
    }
    catch(err){
        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};