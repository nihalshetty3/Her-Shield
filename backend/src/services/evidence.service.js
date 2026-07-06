const crypto = require("crypto");

const startEvidenceCollection = (incident) => {
    const evidence = {
        evidenceId : crypto.randomUUID(),
        incidentId: incident.id,
        status: "COLLECTING",
        startedAt : new Date()
    };

    console.log("\n========== EVIDENCE SERVICE ==========");

    console.log("Evidence ID :", evidence.evidenceId);

    console.log("Incident ID :", evidence.incidentId);

    console.log("Status      :", evidence.status);

    console.log("======================================\n");

    return evidence;
};

module.exports = {
    startEvidenceCollection
};