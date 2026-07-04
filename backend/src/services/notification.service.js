const SMSService = require("./sms.service");

const sendEmergencyAlert = async (incident) => {

    console.log("\n========== NOTIFICATION SERVICE ==========");

    await SMSService.sendSMS(incident);

    console.log("==========================================\n");

};

module.exports = {
    sendEmergencyAlert
};