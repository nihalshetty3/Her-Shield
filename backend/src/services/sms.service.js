
const client = require("../integrations/twilio.client");

const sendSMS = async (incident) => {
    const mapsLink =
`https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`;

    const message = `
    HER SHIELD SOS ALERT

An emergency has been triggered.

Trigger: ${incident.triggerType}

Incident ID:
${incident.id}

Location:
${mapsLink}

Status:
${incident.status}

Please contact the user immediately.
`;
    
try{
    const response = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.GUARDIAN_PHONE
    });

    console.log("SMS sent");
    console.log("Message SID:" , response.sid);
}
    catch(err){
        console.log("SMS failed");
        console.log(err.message);
    }
};

module.exports = {
    sendSMS
};