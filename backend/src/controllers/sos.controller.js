const IncidentService = require("../services/incident.service");
const WorkflowService = require("../services/emergencyWorkflow.service");

const triggerSOS = async (req, res) => {
    try{
        const {triggerType,latitude,longitude} = req.body;
        const incident = IncidentService.createIncident(
            triggerType,
            latitude,
            longitude
        );

        await WorkflowService.startWorkflow(incident);

        return res.status(201).json({
            success:true,
            message: "SOS Triggered Succesfully",
            incident
        });
    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
module.exports = {
    triggerSOS
};
