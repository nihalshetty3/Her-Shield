const crypto = require("crypto");
const incidents = require("../data/incidents");

const VALID_TRIGGERS = [
    "manual",
    "shake",
    "voice",
    "wearable",
    "AI"
];

const createIncident = (triggerType ,latitude , longitude) =>{
    if(!VALID_TRIGGERS.includes(triggerType)){
        throw new Error("Invalid Trigger Type");
    }

    const incident = {
        id : crypto.randomUUID(),
        triggerType,
        status: "ACTIVE",
        latitude,
        longitude,
        createdAt: new Date()
    };

    incidents.push(incident);
    return incident;
};

module.exports = {
    createIncident
};