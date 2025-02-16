import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TreatmentButton = ({ userId, illness }) => {
    const navigate = useNavigate();
    const [treatmentCompleted, setTreatmentCompleted] = useState(false);
    const [conclusion, setConclusion] = useState("");

    useEffect(() => {
        // Fetch treatment data from the backend
        const fetchTreatment = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/treatment/${userId}`);

                if (response.data.treatment && response.data.treatment.illness === illness) {
                    setTreatmentCompleted(true);
                    setConclusion(response.data.treatment.conclusion);
                }
            } catch (error) {
                console.error("Error fetching treatment data:", error);
            }
        };

        fetchTreatment();
    }, [userId, illness]);

    return (
        <div>
            {treatmentCompleted ? (
                <button
                    className="treatment-button view-conclusion"
                    onClick={() => alert(`Conclusion: ${conclusion}`)} // Replace with a modal if needed
                >
                    View Conclusion
                </button>
            ) : (
                <button
                    className="treatment-button start-treatment"
                    onClick={() => navigate("/treatment", { state: { illnessData: { userId, illness } } })}
                >
                    Treat {illness}
                </button>
            )}
        </div>
    );
};

export default TreatmentButton;
