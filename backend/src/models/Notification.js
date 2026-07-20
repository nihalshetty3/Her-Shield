const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({

    incidentId: String,

    smsSent: Boolean,

    smsSid: String,

    callPlaced: Boolean,

    callSid: String,

    guardianNumber: String,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Notification", NotificationSchema);