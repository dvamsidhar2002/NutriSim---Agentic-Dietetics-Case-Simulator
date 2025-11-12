import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>NutriSim Dashboard</h1>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Cases</h3>
            <p className="stat-number">0</p>
            <span className="stat-label">Simulations in progress</span>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">0</p>
            <span className="stat-label">Cases finished</span>
          </div>

          <div className="stat-card">
            <h3>Performance</h3>
            <p className="stat-number">--%</p>
            <span className="stat-label">Average score</span>
          </div>

          <div className="stat-card">
            <h3>Learning Hours</h3>
            <p className="stat-number">0</p>
            <span className="stat-label">Time spent learning</span>
          </div>
        </div>

        <div className="action-section">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            {/* Updated: Make functional */}
            <button 
              className="action-card"
              onClick={() => navigate("/case-simulation")}
            >
              <div className="action-icon">📋</div>
              <h3>Start New Case</h3>
              <p>Begin a new nutrition simulation</p>
            </button>

            <button className="action-card" onClick={() => alert("Coming soon!")}>
              <div className="action-icon">📚</div>
              <h3>View Cases</h3>
              <p>Browse available case studies</p>
            </button>

            <button className="action-card" onClick={() => alert("Coming soon!")}>
              <div className="action-icon">📊</div>
              <h3>My Progress</h3>
              <p>Track your learning journey</p>
            </button>

            <button className="action-card" onClick={() => alert("Coming soon!")}>
              <div className="action-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Manage your profile</p>
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <p className="no-activity">No recent activity. Start your first case!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;