const NotificationService = require("./notification.service");

const startWorkflow = async (incident) => {

    console.log("\n========== EMERGENCY WORKFLOW ==========");

    console.log("Incident ID :", incident.id);

    console.log("Workflow Started");

    console.log("========================================");

    await NotificationService.sendEmergencyAlert(incident);

};

module.exports = {
    startWorkflow
};