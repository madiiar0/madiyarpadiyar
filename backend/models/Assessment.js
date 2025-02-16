// models/Assessment.js
const mongoose = require("mongoose");

const mentalIllnessResultSchema = new mongoose.Schema({
    illness: { type: String, required: true },
    value: { type: Number, required: true },
    description: { type: String, default: "" },
    characteristics: { type: [String], default: [] },
});

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // The "result" field can store both test responses and/or treatment session data.
    result: {
        responses: { type: Object }, // For storing Likert test responses
        results: { type: [mentalIllnessResultSchema] }, // For final test evaluation
        conversation: { type: Array }, // For treatment conversation history
        finalTreatmentPlan: { type: String },
        timestamp: { type: Date },
    },
    // The "conclusion" field is used for treatment game summaries.
    conclusion: {
        mentalTestDate: { type: Date, default: Date.now },
        summary: { type: String, default: "" },
        advice: { type: String, default: "" },
        feedback: { type: String, default: "" },
        catchyThought: { type: String, default: "" },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Assessment", assessmentSchema);
