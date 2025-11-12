import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMsg("Welcome, " + data.full_name + "!");
        localStorage.setItem("username", data.username);
        localStorage.setItem("fullName", data.full_name);
        
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setMsg(data.message || "Invalid login credentials.");
      }
    } catch (error) {
      setMsg("Network error. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="login-box">
        <h2 className="login-title">Login</h2>
        <input 
          name="username" 
          placeholder="Username" 
          className="login-input" 
          onChange={handleChange}
          value={form.username}
          required
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          className="login-input" 
          onChange={handleChange}
          value={form.password}
          required
        />
        <button type="submit" className="login-button">Login</button>
        
        {/* NEW: Forgot Password Link */}
        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default Login;