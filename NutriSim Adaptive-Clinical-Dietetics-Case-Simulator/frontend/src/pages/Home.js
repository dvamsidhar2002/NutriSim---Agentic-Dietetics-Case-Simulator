import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem("username");
    setIsLoggedIn(!!username);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Master Clinical Nutrition Through
            <span className="highlight"> Interactive Simulations</span>
          </h1>
          <p className="hero-subtitle">
            Experience real-world nutrition scenarios in a risk-free environment.
            Build confidence, make better decisions, and advance your career.
          </p>
          
          {/* Conditionally render buttons only if NOT logged in */}
          {!isLoggedIn && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          )}

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Case Studies</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">🥗</div>
          <div className="floating-card card-2">📊</div>
          <div className="floating-card card-3">💊</div>
          <div className="floating-card card-4">🏥</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose NutriSim?</h2>
        <p className="section-subtitle">
          Everything you need to excel in clinical nutrition practice
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Interactive Cases</h3>
            <p>
              Engage with realistic patient scenarios based on actual clinical
              situations and research-backed protocols.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI-Powered Learning</h3>
            <p>
              Adaptive difficulty that adjusts to your skill level, ensuring
              optimal learning progression.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Progress Tracking</h3>
            <p>
              Monitor your improvement with detailed analytics and performance
              metrics over time.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Expert Feedback</h3>
            <p>
              Receive immediate, detailed explanations for every decision to
              understand the reasoning behind best practices.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Certification</h3>
            <p>
              Earn certificates upon completion to showcase your skills and
              enhance your professional profile.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>24/7 Access</h3>
            <p>
              Learn at your own pace, anytime, anywhere. Desktop and
              mobile-friendly platform.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Start your journey in just 4 simple steps
        </p>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">📝</div>
            <h3>Create Account</h3>
            <p>Sign up in seconds and access your personalized dashboard</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">🔍</div>
            <h3>Choose Case</h3>
            <p>Select from various nutrition scenarios and difficulty levels</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">🎮</div>
            <h3>Make Decisions</h3>
            <p>Apply your knowledge to solve real-world nutrition challenges</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-icon">🏆</div>
            <h3>Learn & Improve</h3>
            <p>Get feedback, track progress, and master clinical nutrition</p>
          </div>
        </div>
      </section>

      {/* Case Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Explore Case Categories</h2>
        <p className="section-subtitle">
          Comprehensive coverage of clinical nutrition specialties
        </p>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon">👶</div>
            <h3>Pediatric Nutrition</h3>
            <p>Growth, development, and childhood disorders</p>
          </div>
          <div className="category-card">
            <div className="category-icon">👴</div>
            <h3>Geriatric Nutrition</h3>
            <p>Age-related conditions and elderly care</p>
          </div>
          <div className="category-card">
            <div className="category-icon">⚡</div>
            <h3>Sports Nutrition</h3>
            <p>Performance optimization and athlete health</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🏥</div>
            <h3>Clinical Nutrition</h3>
            <p>Diabetes, heart disease, and chronic conditions</p>
          </div>
          <div className="category-card">
            <div className="category-icon">⚖️</div>
            <h3>Weight Management</h3>
            <p>Obesity treatment and sustainable weight loss</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🔬</div>
            <h3>Critical Care</h3>
            <p>ICU nutrition and acute medical conditions</p>
          </div>
        </div>
      </section>

      {/* CTA Section - Also hide if logged in */}
      {!isLoggedIn && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Transform Your Nutrition Practice?</h2>
            <p>
              Join thousands of students and professionals who are mastering
              clinical nutrition with NutriSim
            </p>
            <Link to="/register" className="btn btn-large">
              Start Learning Today
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>NutriSim</h4>
            <p>Interactive clinical nutrition simulation platform</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/cases">Case Library</Link></li>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 NutriSim. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;