import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CaseSimulation.css";

function CaseSimulation() {
  const [username, setUsername] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [currentCase, setCurrentCase] = useState(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("select"); // select, case, answer, evaluation
  const [clarifyingQuestions, setClarifyingQuestions] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/login");
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const generateCase = async () => {
    setLoading(true);
    try {
        const response = await fetch("http://localhost:5000/api/cases/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, difficulty }),
        });

        const data = await response.json();

        if (data.success) {
        setCurrentCase(data);
        setStep("case");
        setAnswer("");
        setEvaluation(null);
        setClarifyingQuestions("");
        } else {
        // Show detailed error message
        alert(`Error: ${data.message || 'Failed to generate case. Please try again.'}`);
        console.error("API Error:", data);
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Network error. Please check if the backend server is running on http://localhost:5000");
    } finally {
        setLoading(false);
    }
    };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please provide an answer before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/cases/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case: currentCase.case,
          answer: answer,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);
        setStep("evaluation");

        // Get clarifying questions if score is below 80
        if (data.evaluation.score < 80) {
          getClarifyingQuestions(data.evaluation);
        }
      } else {
        alert("Failed to evaluate answer. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getClarifyingQuestions = async (evalData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/cases/clarifying-questions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            case: currentCase.case,
            answer: answer,
            missing_points: evalData.missing_points || [],
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setClarifyingQuestions(data.questions);
      }
    } catch (error) {
      console.error("Error getting questions:", error);
    }
  };

  const startNewCase = () => {
    setStep("select");
    setCurrentCase(null);
    setAnswer("");
    setEvaluation(null);
    setClarifyingQuestions("");
  };

  return (
    <div className="case-simulation-container">
      {/* Step 1: Select Difficulty */}
      {step === "select" && (
        <div className="difficulty-selector">
          <h1>Start a New Case</h1>
          <p>Select the difficulty level for your case study:</p>

          <div className="difficulty-cards">
            <div
              className={`difficulty-card ${
                difficulty === "beginner" ? "selected" : ""
              }`}
              onClick={() => setDifficulty("beginner")}
            >
              <div className="difficulty-icon">🌱</div>
              <h3>Beginner</h3>
              <p>Single condition, straightforward dietary needs</p>
            </div>

            <div
              className={`difficulty-card ${
                difficulty === "intermediate" ? "selected" : ""
              }`}
              onClick={() => setDifficulty("intermediate")}
            >
              <div className="difficulty-icon">⚡</div>
              <h3>Intermediate</h3>
              <p>Multiple conditions with some complications</p>
            </div>

            <div
              className={`difficulty-card ${
                difficulty === "advanced" ? "selected" : ""
              }`}
              onClick={() => setDifficulty("advanced")}
            >
              <div className="difficulty-icon">🔥</div>
              <h3>Advanced</h3>
              <p>Complex cases with multiple comorbidities</p>
            </div>
          </div>

          <button
            className="generate-case-btn"
            onClick={generateCase}
            disabled={loading}
          >
            {loading ? "Generating Case..." : "Generate Case"}
          </button>

          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Step 2: Display Case */}
      {step === "case" && currentCase && (
        <div className="case-display">
          <div className="case-header">
            <h2>Clinical Case Study</h2>
            <span className="difficulty-badge">{difficulty.toUpperCase()}</span>
          </div>

          <div className="case-content">
            <pre>{currentCase.case}</pre>
          </div>

          <div className="answer-section">
            <h3>Your Assessment</h3>
            <p>Provide your nutritional assessment including:</p>
            <ul>
              <li>Nutritional diagnosis (PES statements)</li>
              <li>Dietary recommendations</li>
              <li>Intervention strategies</li>
              <li>Monitoring and evaluation plan</li>
            </ul>

            <textarea
              className="answer-textarea"
              placeholder="Type your detailed assessment here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={15}
            />

            <div className="action-buttons">
              <button
                className="submit-btn"
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
              >
                {loading ? "Evaluating..." : "Submit Answer"}
              </button>
              <button className="cancel-btn" onClick={startNewCase}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Show Evaluation */}
      {step === "evaluation" && evaluation && (
        <div className="evaluation-display">
          <div className="evaluation-header">
            <h2>Evaluation Results</h2>
            <div className="score-badge">
              <span className="score-number">{evaluation.score}</span>
              <span className="score-label">/100</span>
            </div>
          </div>

          <div className="evaluation-content">
            {/* Correct Points */}
            {evaluation.correct_points && evaluation.correct_points.length > 0 && (
              <div className="eval-section correct">
                <h3>✅ Correct Points</h3>
                <ul>
                  {evaluation.correct_points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Points */}
            {evaluation.missing_points && evaluation.missing_points.length > 0 && (
              <div className="eval-section missing">
                <h3>⚠️ Missing Points</h3>
                <ul>
                  {evaluation.missing_points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Incorrect Points */}
            {evaluation.incorrect_points &&
              evaluation.incorrect_points.length > 0 && (
                <div className="eval-section incorrect">
                  <h3>❌ Incorrect Points</h3>
                  <ul>
                    {evaluation.incorrect_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Feedback */}
            <div className="eval-section feedback">
              <h3>📝 Detailed Feedback</h3>
              <p>{evaluation.feedback}</p>
            </div>

            {/* Clinical Reasoning */}
            <div className="eval-section reasoning">
              <h3>🧠 Clinical Reasoning</h3>
              <p className="reasoning-badge">{evaluation.clinical_reasoning}</p>
            </div>

            {/* Clarifying Questions */}
            {clarifyingQuestions && (
              <div className="eval-section questions">
                <h3>💡 Questions to Think About</h3>
                <pre>{clarifyingQuestions}</pre>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button className="new-case-btn" onClick={startNewCase}>
              Start New Case
            </button>
            <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseSimulation;