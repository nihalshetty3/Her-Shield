const crypto = require("crypto");
const incidents = require("../data/incidents");

const VALID_TRIGGERS = [
    "manual",
    "shake",
    "voice",
    "wearable"
];

const createIncident = (triggerType) =>{
    if(!VALID_TRIGGERS.includes(triggerType)){
        throw new Error("Invalid Trigger Type");
    }

    const incident = {
        id : crypto.randomUUID(),
        triggerType,
        status: "ACTIVE",
        createdAt: new Date()
    };

    incidents.push(incident);
    return incident;
};

module.exports = {
    createIncident
};