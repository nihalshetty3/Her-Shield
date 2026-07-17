const client = require("../integrations/twilio.client");

const makeEmergencyCall = async(incident) => {
    console.log("Calling Twilio...");
    try{
        const call = await client.calls.create({
            to:process.env.GUARDIAN_PHONE,
            from:process.env.TWILIO_PHONE_NUMBER,

            twiml:`
            <Response>
            <Say voice="Nihal">
             Emergency Alert from Her Shield.
            An SOS has been triggered.
            Please contact the user immediately.
            </Say>
            </Response>
            `
        });

        console.log("Call Initiated");
        console.log("Call SID:" , call.sid);
    }

    catch(err){
        console.log("Call Failed");
        console.log(err.message);
    }
};

module.exports = {
    makeEmergencyCall
};