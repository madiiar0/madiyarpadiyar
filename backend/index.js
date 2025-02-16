const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
    })
);

// MongoDB Connection (your connection string remains unchanged)
const mongoURI = process.env.MONGO_URI;
mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Define User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Import the Assessment model
const Assessment = require("./models/Assessment");
const Treatment = require("./models/Treatment"); // Import the Treatment model

// Save a treatment conclusion
app.post("/treatment/save", async (req, res) => {
    try {
        console.log("Received treatment data:", req.body); // Debug log

        const { userId, illness, severity, conclusion } = req.body;

        if (!userId || !illness || !severity || !conclusion) {
            console.log("Missing fields:", { userId, illness, severity, conclusion });
            return res.status(400).json({ message: "Missing required fields" });
        }

        let treatment = await Treatment.findOne({ userId, illness });

        if (treatment) {
            treatment.conclusion = conclusion;
            treatment.severity = severity;
            treatment.timestamp = new Date();
        } else {
            treatment = new Treatment({ userId, illness, severity, conclusion });
        }

        await treatment.save();
        console.log("Successfully saved treatment:", treatment);
        res.status(201).json({ message: "Treatment saved successfully", treatment });
    } catch (error) {
        console.error("Error saving treatment:", error);
        res.status(500).json({ message: "Error saving treatment data" });
    }
});


// ---------------------
// Authentication Routes
// ---------------------

app.get("/treatment/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch all treatments for the user
        const treatments = await Treatment.find({ userId });

        if (!treatments.length) {
            return res.status(404).json({ message: "No treatments found" });
        }

        res.status(200).json({ treatments });
    } catch (error) {
        console.error("Error fetching treatment:", error);
        res.status(500).json({ message: "Error retrieving treatment data" });
    }
});


app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        const savedUser = await newUser.save();

        res
            .status(201)
            .json({ user: { id: savedUser._id, username: savedUser.username } });
    } catch (err) {
        res.status(500).json("Error signing up user");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json("Invalid username or password");
        }
        res.status(200).json({ user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json("Error logging in user");
    }
});



// Clears all data for a given user (assessments, treatments, etc.)
app.delete("/clearAllUserData/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        // Delete all assessments for this user
        await Assessment.deleteMany({ userId });

        // Delete all treatments (including conclusions) for this user
        await Treatment.deleteMany({ userId });

        res.status(200).json({ message: "All user data cleared" });
    } catch (err) {
        console.error("Error clearing user data:", err);
        res.status(500).json({ error: "Error clearing user data" });
    }
});






// ---------------------
// Assessment Routes
// ---------------------

// Save a new assessment (mental test or treatment session)
app.post("/assessment/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const assessment = new Assessment({ userId, ...req.body });
        const savedAssessment = await assessment.save();
        res.status(201).json({ assessment: savedAssessment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error saving assessment" });
    }
});

// Get all assessments for a user
app.get("/assessment/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const assessments = await Assessment.find({ userId });
        res.status(200).json({ assessments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching assessments" });
    }
});

// Delete all assessments for a user (for “Redo Test”)
app.delete("/assessment/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        await Assessment.deleteMany({ userId });
        res.status(200).json({ message: "Assessments cleared" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting assessments" });
    }
});

// Start Server
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

