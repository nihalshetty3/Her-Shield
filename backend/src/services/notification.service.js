const SMSService = require("./sms.service");
const CallService = require("./call.service");
const sendEmergencyAlert = async (incident) => {

    console.log("\n========== NOTIFICATION SERVICE ==========");

    await SMSService.sendSMS(incident);
    
    await CallService.makeEmergencyCall(incident);

    console.log("==========================================\n");

};

module.exports = {
    sendEmergencyAlert
};