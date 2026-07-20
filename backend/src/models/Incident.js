const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
    incidentId: {
        type:String,
        unique: true
    },

    triggerType: String,
    status:{
        type:String,
        default:"ACTIVE"
    },

    latitude: Number,
    longitude: Number,
    risk:String,

    transcription: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Incident", IncidentSchema);