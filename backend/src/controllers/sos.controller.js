const IncidentService = require("../services/incident.service");
const WorkflowService = require("../services/emergencyWorkflow.service");

const triggerSOS = async (req, res) => {

    console.log("🔥 SOS endpoint hit");
    console.log(req.body);

    try {

        const { triggerType, location } = req.body;

        const latitude = location?.latitude;
        const longitude = location?.longitude;

        const incident = await IncidentService.createIncident(
            triggerType,
            latitude,
            longitude
        );

        console.log("Incident:", incident);

        await WorkflowService.startWorkflow(incident);

        return res.status(201).json({
            success: true,
            message: "SOS Triggered Successfully",
            incident
        });

    } catch (err) {

        console.error("Controller Error:", err);

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
    triggerSOS
};