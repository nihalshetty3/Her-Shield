const sendAudioToAI = require("../services/ai.service");
const { startWorkflow } = require("../services/emergencyWorkflow.service");
const fs = require("fs");

const analyzeAudio = async (req, res) => {
    try {
        console.log(req.file);
        console.log(req.body);
        console.log(req.file);

        const header = fs.readFileSync(req.file.path).slice(0, 16);

        console.log("Header:", header);
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Audio file is required."
            });
        }

        const aiResult = await sendAudioToAI(req.file);
        console.log("AI Result:", aiResult);

        if (aiResult.triggerSOS) {
            const incident = {
                id: aiResult.incidentId,
                summary: aiResult.analysis.summary,
                risk: aiResult.risk,
                confidence: aiResult.aiDecision?.confidence,
                transcription: aiResult.transcription,
                screamDetection: aiResult.screamDetection,
                time: new Date().toISOString()
            };

            await startWorkflow(incident);
        }

        return res.status(200).json(aiResult);

    } catch (error) {

        console.error("Audio Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to analyze audio."
        });
    }
};

module.exports = {
    analyzeAudio
};