import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./profile.css";

const ScaleBar = ({ value }) => {
    return (
        <div className="scale-bar-container">
            <div
                className="scale-bar"
                style={{
                    width: `${value}%`,
                }}
            ></div>
        </div>
    );
};




const Profile = () => {
    const navigate = useNavigate();
    const { user, logout, theme, toggleTheme } = useAuth();
    const [assessments, setAssessments] = useState([]);
    const [treatments, setTreatments] = useState({});

    // 1) Move the handleRedoTest function INSIDE the component
    const handleRedoTest = async () => {
        try {
            if (!user || !user.id) {
                console.error("No user or user ID found.");
                return;
            }
            // Clear all data including assessments and treatment conclusions
            await axios.delete(`http://localhost:5555/clearAllUserData/${user.id}`);
            // Navigate to the test page after data is cleared
            navigate("/test");
        } catch (error) {
            console.error("Error clearing user data", error);
        }
    };


    useEffect(() => {
        if (user && user.id) {
            // Fetch test results (assessments)
            axios
                .get(`http://localhost:5555/assessment/${user.id}`)
                .then((response) => setAssessments(response.data.assessments))
                .catch((err) => console.error("Error fetching assessments", err));

            // Fetch treatments
            axios
                .get(`http://localhost:5555/treatment/${user.id}`)
                .then((response) => {
                    const treatmentData = response.data.treatments || [];
                    const mappedTreatments = {};

                    treatmentData.forEach((treatment) => {
                        mappedTreatments[treatment.illness] = treatment.conclusion;
                    });

                    setTreatments(mappedTreatments);
                })
                .catch((err) => console.error("Error fetching treatment data", err));
        }
    }, [user]);

    return (
        <div className={`profile-page ${theme}`}>
            <nav className="header">
                <div className="logo">🧠 PixelTherapy</div>
                <ul className="nav-links">
                    <li><a href="../">🏠 Home</a></li>
                    <li><a href="../#how-it-works">💬 How It Works</a></li>
                    <li><a href="../#interactive-stories">📖 Interactive Stories</a></li>
                    <li><a href="../#meet-ai">🤖 Meet Your AI Therapist</a></li>
                    <li><a href="../#testimonials">🌟 Testimonials</a></li>
                    {user ? (
                        <>
                            <li><button className="header-button" onClick={() => navigate("/profile")}>👤 Profile</button></li>
                            <li><button className="header-button" onClick={logout}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><button className="header-button" onClick={() => navigate("/signin")}>Sign In</button></li>
                            <li><button className="header-button signup" onClick={() => navigate("/signup")}>Sign Up</button></li>
                        </>
                    )}
                    <li>
                        <div className="toggle-container" onClick={toggleTheme} aria-label="Toggle Day/Night Mode">
                            {theme === "light" ? "🌞" : "🌜"}
                        </div>
                    </li>
                </ul>
            </nav>

            <div className="profile-layout">
                {/* Profile Overview */}
                <div className="profile-overview">
                    <div className="avatar"></div>
                    <div className="user-details">
                        <h2>{user?.username}</h2>
                        <p>Your personalized mental health journey starts here.</p>
                    </div>
                </div>

                {/* Test Results Section */}
                <div className="test-results">
                    {assessments.length > 0 ? (
                        assessments.map((item, index) => (
                            <div key={index} className="test-card">
                                <h3>Test taken on {new Date(item.createdAt).toLocaleDateString()}</h3>
                                {item.result.results && item.result.results.length > 0 ? (
                                    item.result.results.map((resultItem, i) => {
                                        const { illness, value } = resultItem;
                                        const conclusion = treatments[illness];

                                        return (
                                            <div key={i} className="result-item">
                                                <h4>{illness}</h4>
                                                <p>Severity: {value}%</p>
                                                <ScaleBar value={value} />

                                                {conclusion ? (
                                                    <button
                                                        className="view-conclusion-button"
                                                        onClick={() => alert(`Conclusion: ${conclusion}`)}
                                                    >
                                                        View Conclusion
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="treat-button"
                                                        onClick={() =>
                                                            navigate("/treatment", {
                                                                state: {
                                                                    illnessData: {
                                                                        ...resultItem,
                                                                        userId: user.id,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                    >
                                                        Treat {resultItem.illness}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>No detailed results available.</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No test results available.</p>
                    )}
                </div>

                {/* Redo Test Button */}
                {assessments.length > 0 && (
                    <div className="redo-test-container">
                        <button className="redo-button" onClick={handleRedoTest}>
                            Redo Test
                        </button>
                    </div>
                )}

                {/* Recommendations Section */}
                <div className="recommendations">
                    <h3>Today's Tip:</h3>
                    <p>"Take 5 minutes to practice deep breathing and gratitude."</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
