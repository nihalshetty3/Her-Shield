const NotificationService = require("./notification.service");
const EvidenceService = require("./evidence.service");

const startWorkflow = async (incident) => {

    console.log("\n========== EMERGENCY WORKFLOW ==========");

    console.log("Incident ID :", incident.id);

    console.log("Workflow Started");

    console.log("========================================");

    await NotificationService.sendEmergencyAlert(incident);
    EvidenceService.startEvidenceCollection(incident);
};

module.exports = {
    startWorkflow
};