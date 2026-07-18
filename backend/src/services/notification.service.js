const SMSService = require("./sms.service");
const CallService = require("./call.service");
const sendEmergencyAlert = async (incident) => {

    console.log("========== NOTIFICATION SERVICE ==========");
    console.log(incident);

    await SMSService.sendSMS(incident);
    console.log("SMS Done");

    await CallService.makeEmergencyCall(incident);
    console.log("Call Done");

    console.log("==========================================");

};

module.exports = {
    sendEmergencyAlert
};