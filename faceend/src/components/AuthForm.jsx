import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AuthForm.css";

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { login, user, logout, theme, toggleTheme } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add(theme);
        return () => {
            document.body.classList.remove(theme);
        };
    }, [theme]);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            document.body.className = storedTheme;
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isSignUp ? "http://localhost:5555/signup" : "http://localhost:5555/login";
            const response = await axios.post(endpoint, { username, password });

            if (response.status === 200 || response.status === 201) {
                console.log("User logged in:", response.data.user);
                login(response.data.user);
                navigate("/");
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className={`auth-container ${theme}`}>
            {/* Header */}
            <nav className={`header ${theme}`}>
                <div className="logo">🧠 PixelTherapy</div>
                <ul className="nav-links">
                    <li><a href="/">🏠 Home</a></li>
                    <li><a href="/#how-it-works">💬 How It Works</a></li>
                    <li><a href="/#interactive-stories">📖 Interactive Stories</a></li>
                    <li><a href="/#meet-ai">🤖 Meet Your AI Therapist</a></li>
                    <li><a href="/#testimonials">🌟 Testimonials</a></li>

                    {user ? (
                        <>
                            <li>
                                <button className="header-button" onClick={() => navigate('/profile')}>
                                    👤 Profile
                                </button>
                            </li>
                            <li>
                                <button className="header-button" onClick={logout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <button className="header-button" onClick={() => navigate('/signin')}>
                                    Sign In
                                </button>
                            </li>
                            <li>
                                <button className="header-button signup" onClick={() => navigate('/signup')}>
                                    Sign Up
                                </button>
                            </li>
                        </>
                    )}
                    <li>
                        <div className="toggle-container" onClick={() => {
                            const newTheme = theme === "light" ? "dark" : "light";
                            toggleTheme();
                            localStorage.setItem("theme", newTheme);
                        }} aria-label="Toggle Day/Night Mode">
                            {theme === 'light' ? '🌞' : '🌜'}
                        </div>
                    </li>
                </ul>
            </nav>

            <div className="auth-card">
                <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">{isSignUp ? "Sign Up" : "Log In"}</button>
                </form>
                <p className="toggle-text">
                    {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
                    <span className="toggle-link" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? "Log In" : "Sign Up"}
                    </span>
                </p>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default AuthForm;
