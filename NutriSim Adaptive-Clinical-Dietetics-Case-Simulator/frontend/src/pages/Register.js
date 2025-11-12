import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    full_name: "",  // NEW
    phone: "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMsg("Registration successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMsg(data.message || "Registration failed");
      }
    } catch (error) {
      setMsg("Network error. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="register-box">
        <h2 className="register-title">Register</h2>
        
        <input
          name="full_name"
          placeholder="Full Name"
          className="register-input"
          onChange={handleChange}
          value={form.full_name}
          required
        />
        
        <input
          name="username"
          placeholder="Username"
          className="register-input"
          onChange={handleChange}
          value={form.username}
          required
        />
        
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="register-input"
          onChange={handleChange}
          value={form.email}
          required
        />
        
        <input
          name="phone"
          placeholder="Phone"
          className="register-input"
          onChange={handleChange}
          value={form.phone}
          required
        />
        
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="register-input"
          onChange={handleChange}
          value={form.password}
          required
        />
        
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      {msg && <p className="register-message">{msg}</p>}
    </div>
  );
}

export default Register;