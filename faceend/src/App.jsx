// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainPage from './components/MainPage';
import AuthForm from './components/AuthForm';
import Test from './components/test';
import Profile from './components/profile';
import Treatment from './components/Treatment.jsx';
// import Result from "./components/result";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/signin" element={<AuthForm />} />
                    <Route path="/signup" element={<AuthForm />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/treatment" element={<Treatment />} />
                    {/*<Route path="/treatment-summary" element={<TreatmentSummary />} />*/}
                    {/*<Route path="/result" element={<Result />} />*/}
                    {/* Add other routes */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
