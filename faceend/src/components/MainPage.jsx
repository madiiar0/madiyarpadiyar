import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';

function MainPage() {
    const { user, logout, theme, toggleTheme } = useAuth();
    const navigate = useNavigate();

    const handleCTAClick = () => navigate('#mental-test');

    const handleStartTest = async () => {
        if (user) {
            try {
                const res = await axios.get(`http://localhost:5555/assessment/${user.id}`);
                if (res.data.assessments && res.data.assessments.length > 0) {
                    navigate('/profile');
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        }
        navigate('/test');
    };

    const handleSignIn = () => navigate('/signin');
    const handleSignUp = () => navigate('/signup');

    return (
        <div className={`main-page ${theme}`}>
            <nav className="header">
                <div className="logo">🧠 PixelTherapy</div>
                <ul className="nav-links">
                    <li><a href="#home">🏠 Home</a></li>
                    <li><a href="#how-it-works">💬 How It Works</a></li>
                    <li><a href="#interactive-stories">📖 Interactive Stories</a></li>
                    <li><a href="#meet-ai">🤖 Meet Your AI Therapist</a></li>
                    <li><a href="#testimonials">🌟 Testimonials</a></li>
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
                                <button className="header-button" onClick={handleSignIn}>
                                    Sign In
                                </button>
                            </li>
                            <li>
                                <button className="header-button signup" onClick={handleSignUp}>
                                    Sign Up
                                </button>
                            </li>
                        </>
                    )}
                    <li>
                        <div className="toggle-container" onClick={toggleTheme} aria-label="Toggle Day/Night Mode">
                            {theme === 'light' ? '🌞' : '🌜'}
                        </div>
                    </li>
                </ul>
            </nav>
            <section className="hero" id="home">
                <div className="hero-background">
                    <img src="../../public/floating-scroll.png" alt="Pixel Therapist Office" className="pixel-office"/>
                    <img src="../../public/pxiel-office.png" alt="Floating Scroll" className="floating-scroll-element"/>
                    <img src="../../public/cozy-character.png" alt="Cozy Character" className="cozy-character"/>
                </div>
                <div className="hero-content">
                    <h1>Your story matters.<br/>Let’s explore it together.</h1>
                    <p className="hero-subtext">Take the first step toward self-discovery with our mental health test.
                        Personalized stories and games await!</p>
                    <button className="cta-button" onClick={handleStartTest}>
                        Take Your Mental Test
                    </button>
                </div>
            </section>
            <section className="mental-test" id="mental-test">
                <h2>Start Your Mental Test</h2>
                <p>Before exploring interactive therapy stories, please take our mental test to assess your emotional state.</p>
                <button className="start-test-button" onClick={handleStartTest}>
                    Start Test 📝
                </button>
            </section>
            <section className="how-it-works" id="how-it-works">
                <h2>How It Works</h2>
                <div className="timeline">
                    <div className="timeline-step">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff69b4" xmlns="http://www.w3.org/2000/svg" className="timeline-icon">
                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2" stroke="#ff69b4" strokeWidth="2" fill="none" />
                            <path d="M7 10l3 3l7-7" stroke="#ff69b4" strokeWidth="2" fill="none" />
                        </svg>
                        <h3 className="step-title">Take Your Mental Test</h3>
                        <p className="step-description">Assess your current emotional state with our comprehensive mental health test.</p>
                    </div>
                    <div className="timeline-step">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff69b4" xmlns="http://www.w3.org/2000/svg" className="timeline-icon">
                            <circle cx="11" cy="11" r="8" stroke="#ff69b4" strokeWidth="2" fill="none" />
                            <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="#ff69b4" strokeWidth="2" />
                        </svg>
                        <h3 className="step-title">Receive Personalized Results</h3>
                        <p className="step-description">Get insights tailored to your responses, highlighting areas for growth and focus.</p>
                    </div>
                    <div className="timeline-step">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff69b4" xmlns="http://www.w3.org/2000/svg" className="timeline-icon">
                            <path d="M3 4h18v16H3V4z" stroke="#ff69b4" strokeWidth="2" fill="none" />
                            <line x1="7" y1="8" x2="17" y2="8" stroke="#ff69b4" strokeWidth="2" />
                            <line x1="7" y1="12" x2="17" y2="12" stroke="#ff69b4" strokeWidth="2" />
                            <line x1="7" y1="16" x2="17" y2="16" stroke="#ff69b4" strokeWidth="2" />
                        </svg>
                        <h3 className="step-title">Explore Interactive Stories</h3>
                        <p className="step-description">Dive into engaging stories designed to resonate with your personal experiences.</p>
                    </div>
                    <div className="timeline-step">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff69b4" xmlns="http://www.w3.org/2000/svg" className="timeline-icon">
                            <circle cx="12" cy="12" r="10" stroke="#ff69b4" strokeWidth="2" fill="none" />
                            <circle cx="8" cy="10" r="1.5" fill="#ff69b4" />
                            <circle cx="16" cy="10" r="1.5" fill="#ff69b4" />
                            <path d="M8 16c1.333-1.333 2.667-1.333 4 0" stroke="#ff69b4" strokeWidth="2" fill="none" />
                        </svg>
                        <h3 className="step-title">Engage in AI-Guided Therapy</h3>
                        <p className="step-description">Interact with our AI therapist for supportive and personalized guidance.</p>
                    </div>
                    <div className="timeline-step">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff69b4" xmlns="http://www.w3.org/2000/svg" className="timeline-icon">
                            <path d="M6 6h12v12H6V6z" stroke="#ff69b4" strokeWidth="2" fill="none" />
                            <circle cx="8" cy="8" r="1" fill="#ff69b4" />
                            <circle cx="16" cy="8" r="1" fill="#ff69b4" />
                            <rect x="10" y="14" width="4" height="2" fill="#ff69b4" />
                        </svg>
                        <h3 className="step-title">Unlock Personalized Games</h3>
                        <p className="step-description">Access games that complement your therapy journey, enhancing self-discovery and relaxation.</p>
                    </div>
                </div>
            </section>
            <section className="interactive-stories" id="interactive-stories">
                <h2>Interactive Stories</h2>
                <div className="stories-carousel">
                    <div className="story-card">
                        <img src="../../public/stoty-forest.png" alt="Journey Through the Forest" className="story-thumbnail" />
                        <h3>Journey Through the Forest</h3>
                        <button onClick={() => handleStartTest(1)}>Begin Your Journey</button>
                    </div>
                    <div className="story-card">
                        <img src="../../public/story-ocean.png" alt="Ocean of Emotions" className="story-thumbnail" />
                        <h3>Ocean of Emotions</h3>
                        <button onClick={() => handleStartTest(2)}>Begin Your Journey</button>
                    </div>
                    <div className="story-card">
                        <img src="../../public/mountain-story.png" alt="Mountain of Mindfulness" className="story-thumbnail" />
                        <h3>Mountain of Mindfulness</h3>
                        <button onClick={() => handleStartTest(3)}>Begin Your Journey</button>
                    </div>
                </div>
            </section>
            <section className="meet-ai" id="meet-ai">
                <h2>Meet Your AI Therapist</h2>
                <div className="ai-container">
                    <img src="../../public/pixel-office.png" alt="AI Therapist Avatar" className="pixel-ai-avatar" />
                    <p>
                        Our AI adapts to your unique mental health needs, providing personalized guidance and support through interactive conversations.
                    </p>
                    <button onClick={handleStartTest}>Try a Chat with AI</button>
                </div>
            </section>
            <section className="testimonials" id="testimonials">
                <h2>What Our Users Say</h2>
                <div className="testimonial-bubbles">
                    <div className="testimonial-bubble">
                        <p>"PixelTherapy changed my life!"</p>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                    </div>
                    <div className="testimonial-bubble">
                        <p>"Interactive stories helped me understand myself better."</p>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                    </div>
                    <div className="testimonial-bubble">
                        <p>"The AI therapist is incredibly supportive."</p>
                        <div className="stars">⭐⭐⭐⭐</div>
                    </div>
                    <div className="testimonial-bubble">
                        <p>"Engaging therapy through storytelling!"</p>
                        <div className="stars">⭐⭐⭐⭐</div>
                    </div>
                    <div className="testimonial-bubble">
                        <p>"A comforting and insightful journey."</p>
                        <div className="stars">⭐⭐⭐⭐</div>
                    </div>
                </div>
            </section>
            <section className="try-free" id="try-free">
                <h2>Try a Free Session</h2>
                <button className="start-free-button" onClick={handleStartTest}>
                    Start for Free
                </button>
            </section>
            <footer className="footer">
                <div className="social-media">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                        🐦
                    </a>
                    <a href="https://discord.com" target="_blank" rel="noreferrer" aria-label="Discord">
                        💬
                    </a>
                    <a href="https://instagram.com/shagdarhamza" target="_blank" rel="noreferrer" aria-label="Instagram">
                        📸
                    </a>
                </div>
                <div className="pixel-plant">🌿</div>
            </footer>
        </div>
    );
}

export default MainPage;
