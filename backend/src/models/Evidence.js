const mongoose = require("mongoose");

const EvidentSchema = new mongoose.Schema({
    evidenceId : String,
    incidentId : String,
    audioPath: String,
    transcript:String,
    screamDetected: Boolean,
    distressScore: Number,
    risk:String,
    status:{
        type:String,
        default:"COLLECTING",
    },
    createdAt:{
        type:DataTransfer,
        default:Date.now
    }
});

module.exports = mongoose.model("Evidence", EvidentSchema);