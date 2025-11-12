import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import CaseSimulation from "./pages/CaseSimulation";  // NEW IMPORT
import "./pages/Home.css";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedFullName = localStorage.getItem("fullName");
    
    if (storedUsername && storedFullName) {
      setIsLoggedIn(true);
      setFullName(storedFullName);
    } else {
      setIsLoggedIn(false);
      setFullName("");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("fullName");
    setIsLoggedIn(false);
    setFullName("");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1 className="app-title">NutriSim</h1>
      
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <div className="user-section">
                <span className="welcome-text">Welcome, {fullName}!</span>
                <button onClick={handleLogout} className="logout-nav-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/case-simulation" element={<CaseSimulation />} />  {/* NEW ROUTE */}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;