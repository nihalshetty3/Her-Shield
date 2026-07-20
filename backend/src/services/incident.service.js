const crypto = require("crypto");
const Incident = require("../models/Incident");

const VALID_TRIGGERS = [
    "manual",
    "shake",
    "voice",
    "wearable",
    "AI"
];

const createIncident = async (triggerType ,latitude , longitude) =>{
    if(!VALID_TRIGGERS.includes(triggerType)){
        throw new Error("Invalid Trigger Type");
    }

    const incident = await Incident.create({
        incidentId: crypto.randomUUID(),
        triggerType,
        status:"ACTIVE",
        latitude,
        longitude
    });
    return incident;
};

module.exports = {
    createIncident
};