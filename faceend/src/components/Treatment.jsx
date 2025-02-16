import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./treatment.css";
import { useAuth } from "../contexts/AuthContext";

function GamePage() {
    const location = useLocation();
    const illnessData = location.state?.illnessData || null;

    const [messages, setMessages] = useState([]);
    const [scenario, setScenario] = useState("");
    const [choices, setChoices] = useState([]);
    const [isFinal, setIsFinal] = useState(false);
    const [conclusion, setConclusion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { user, theme, toggleTheme } = useAuth();
    const openaiApiKey = import.meta.env.VITE_APP_OPENAI_API_KEY || "";

    useEffect(() => {
        if (illnessData) {
            startGame();
        }
    }, [illnessData]);

    const callOpenAIAPI = async (updatedMessages) => {
        if (!openaiApiKey) {
            throw new Error("OpenAI API key not set in environment");
        }
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                temperature: 0.3,
                messages: updatedMessages,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.choices[0]?.message?.content;
    };

    const startGame = async () => {
        setLoading(true);
        setError("");
        try {
            const initialMessage = {
                role: "system",
                content: `You are a therapeutic AI guiding a user with ${illnessData.illness}. The user has a severity level of ${illnessData.value}%. Tailor the therapy experience specifically for this condition.

Your task is to create an interactive story about a character named Arman who is experiencing ${illnessData.illness}. The narrative should be engaging, empathetic, and designed to help the user relate to and overcome their mental illness.

At each key moment, include a decision point where the user must choose Arman’s next step. For every decision point, provide exactly 4 options:
1. A positive, constructive choice that helps Arman progress.
2. A negative, unhelpful choice that might set him back.
3. A neutral or alternative choice.
4. A second neutral or alternative choice.

Your entire response MUST be a single, valid JSON object with the following structure:
{
  "scenario": "A therapy story scenario describing the current situation",
  "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
  "isFinal": false
}

If the story reaches a logical conclusion, set "isFinal" to true and include an additional key "conclusion" with a summary of Arman’s final outcome. For example:
{
  "scenario": "Final scenario description.",
  "choices": [],
  "isFinal": true,
  "conclusion": "A concluding summary of Arman’s journey and recovery."
}

Do not include any extra keys, markdown formatting, or commentary. Respond ONLY with the JSON object.`
            };

            const updatedMessages = [initialMessage];
            const aiResponse = await callOpenAIAPI(updatedMessages);
            const parsedResponse = JSON.parse(aiResponse);

            setMessages(updatedMessages.concat({ role: "assistant", content: aiResponse }));
            setScenario(parsedResponse.scenario);
            setChoices(parsedResponse.choices || []);
            setIsFinal(!!parsedResponse.isFinal);
            setConclusion(parsedResponse.conclusion || "");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleChoiceClick = async (choice) => {
        if (isFinal) return;
        setLoading(true);
        setError("");
        try {
            const newUserMessage = {
                role: "user",
                content: `I choose: ${choice}`,
            };

            const updatedMessages = [...messages, newUserMessage];
            const aiResponse = await callOpenAIAPI(updatedMessages);
            const parsedResponse = JSON.parse(aiResponse);

            setMessages(updatedMessages.concat({ role: "assistant", content: aiResponse }));
            setScenario(parsedResponse.scenario);
            setChoices(parsedResponse.choices || []);
            setIsFinal(!!parsedResponse.isFinal);
            setConclusion(parsedResponse.conclusion || "");

            if (parsedResponse.isFinal) {
                await saveConclusionToDB(parsedResponse.conclusion);
            }
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const saveConclusionToDB = async (conclusionText) => {
        try {
            const userId = illnessData?.userId || user?.id;
            if (!userId) {
                console.error("User ID is missing, cannot save treatment.");
                return;
            }

            const payload = {
                userId,
                illness: illnessData.illness,
                severity: illnessData.value,
                conclusion: conclusionText,
            };

            console.log("Saving treatment data:", payload);
            const response = await axios.post(`http://localhost:5555/treatment/save`, payload);
            console.log("Saved to DB:", response.data);
        } catch (error) {
            console.error("Error saving conclusion:", error);
        }
    };

    return (
        // Wrap everything in a container that uses the current theme
        <div className={`main-page ${theme}`}>
            <nav className="header">
                <div className="logo">🧠 PixelTherapy</div>
                <div className="toggle-container" onClick={toggleTheme}>
                    {theme === "light" ? "🌞" : "🌜"}
                </div>
            </nav>

            <div className="game-page-background">
                <div className="game-container">
                    <h1 className="game-header">AI Therapy for {illnessData?.illness}</h1>

                    {loading ? (
                        // While loading, display only the loading message.
                        <p>Loading...</p>
                    ) : (
                        <>
                            {error && <p className="error-message">{error}</p>}

                            {!isFinal && scenario && (
                                <div className="scenario-section">
                                    <h2>Scenario</h2>
                                    <p>{scenario}</p>
                                    <div className="choices-section">
                                        <h3>Your Options</h3>
                                        {choices.map((choice, index) => (
                                            <button key={index} onClick={() => handleChoiceClick(choice)}>
                                                {choice}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isFinal && (
                                <div className="final-section">
                                    <h2>Final Scenario</h2>
                                    <p>{scenario}</p>
                                    <h3>Conclusion</h3>
                                    <p>{conclusion}</p>
                                    <button className="back-button" onClick={() => navigate("/profile")}>
                                        Go Back to Profile
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GamePage;
