const mongoose = require("mongoose");

const TreatmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    illness: { type: String, required: true },
    severity: { type: Number, required: true },
    conclusion: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Treatment", TreatmentSchema);
