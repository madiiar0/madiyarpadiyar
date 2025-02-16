import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./test.css";

// Utility function to call OpenAI API
async function callOpenAIAPI(messages) {
    const openaiApiKey = import.meta.env.VITE_APP_OPENAI_API_KEY || "";
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
            temperature: 0.7,
            messages: messages,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

const Test = () => {
    const MAX_QUESTIONS = 15;
    const { user, theme, toggleTheme } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            role: "system",
            content: JSON.stringify({
                instructions: `You are a psychological assessment assistant.
Make one clear, non-judgmental question at a time (for which user will answer in form from Strongly Disagree to Strongly Agree).
After the user responds, generate the next statement based on previous answers.
Respond in JSON format:
{
  "question": "Your question here",
  "terminate": false
}
When enough information has been gathered and user reached around 15 questions, set "terminate": true and provide the final results:
{
  "question": null,
  "terminate": true,
  "results": [
     { "illness": "Detected Illness", "value": 1-100, "description": "Explanation of the illness." },
     { "illness": "Detected Illness", "value": 1-100, "description": "Explanation of the illness." },
     ...
     { "illness": "Detected Illness", "value": 1-100, "description": "Explanation of the illness." }
  ]
}`
            }),
        },
    ]);

    const [currentQuestion, setCurrentQuestion] = useState("");
    const [responses, setResponses] = useState({});
    const [completed, setCompleted] = useState(false);
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const imageMap = {
        1: "/face1.svg",
        2: "/face2.svg",
        3: "/face3.svg",
        4: "/face4.svg",
        5: "/face5.svg",
    };

    useEffect(() => {
        async function checkAssessment() {
            try {
                const res = await axios.get(`http://localhost:5555/assessment/${user.id}`);
                if (res.data.assessments.length > 0) {
                    window.alert("You have already completed the test. Use the Redo button in your profile.");
                    navigate("/profile");
                }
            } catch (err) {
                console.error(err);
            }
        }
        if (user && user.id) {
            checkAssessment();
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!currentQuestion && !completed) {
            fetchNextQuestion(messages);
        }
    }, [currentQuestion, completed]);

    const fetchNextQuestion = async (currentMessages) => {
        setLoading(true);
        setError(null);
        try {
            const assistantReply = await callOpenAIAPI(currentMessages);
            let parsedResponse = JSON.parse(assistantReply);
            if (parsedResponse.terminate) {
                setResult(parsedResponse.results || []);
                setCompleted(true);
                setCurrentQuestion("");

                await axios.post(`http://localhost:5555/assessment/${user.id}`, {
                    result: {
                        responses,
                        results: parsedResponse.results,
                        timestamp: new Date(),
                    },
                });
            } else {
                setCurrentQuestion(parsedResponse.question.trim());
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (answer) => {
        const updatedResponses = { ...responses, [currentQuestion]: answer };
        setResponses(updatedResponses);
        const updatedMessages = [...messages, { role: "user", content: JSON.stringify({ answer, question: currentQuestion }) }];
        setMessages(updatedMessages);

        if (Object.keys(updatedResponses).length >= MAX_QUESTIONS) {
            setCompleted(true);
            fetchFinalResults(updatedMessages);
        } else {
            await fetchNextQuestion(updatedMessages);
        }
    };

    // test.jsx
    const fetchFinalResults = async (updatedMessages) => {
        setLoading(true);
        try {
            const assistantReply = await callOpenAIAPI([
                ...updatedMessages,
                { role: "system", content: `Based on the user's responses, provide a final evaluation in JSON format.` }
            ]);

            let parsedFinal = JSON.parse(assistantReply);
            setResult(parsedFinal.results || []);
            setCompleted(true);

            // IMPORTANT: use /assessment/:userId
            await axios.post(`http://localhost:5555/assessment/${user.id}`, {
                result: {
                    responses,
                    results: parsedFinal.results,
                    timestamp: new Date(),
                },
            });
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const getLikertLabel = (value) => {
        const labels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
        return labels[value - 1];
    };

    const renderQuestion = () => {
        if (loading) return <p className="loading">Loading...</p>;
        if (error) return <p className="error">Error: {error}</p>;
        if (completed) {
            return (
                <div className="results">
                    <h2>Assessmenst Complete</h2>
                    <p>Your assessment is complete. Click below to view your results.</p>
                    <button
                        className="result-button"
                        onClick={() =>
                            navigate("/profile", {
                                state: {assessment: {result, responses, createdAt: new Date()}},
                            })
                        }
                    >
                        See Results
                    </button>

                </div>
            );
        }
        if (!currentQuestion) return <p className="loading">Waiting for question...</p>;

        return (
            <div className="question-container">
                <h2 className="question-text">{currentQuestion}</h2>
                <div className="likert-scale">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <figure key={value} onClick={() => handleAnswer(value)}>
                            <img src={imageMap[value]} alt={getLikertLabel(value)}/>
                            <figcaption>{getLikertLabel(value)}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={`main-page ${theme}`}>
            <nav className="header">
                <div className="logo">🧠 PixelTherapy</div>
                <div className="toggle-container" onClick={toggleTheme}>{theme === "light" ? "🌞" : "🌜"}</div>
            </nav>
            <div className="assessment-tool">
                <h1 className="title">Likert Scale Test</h1>
                {renderQuestion()}
            </div>
        </div>
    );
};

export default Test;
