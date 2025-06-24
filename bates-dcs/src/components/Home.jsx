import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
      <div className="hero-content">
          <h1>Welcome to Digital and Computational Studies</h1>
          <p className="hero-subtitle">Your Gateway to Academic Success</p>
          <div className="hero-buttons">
            <Link to="/questionnaire" className="cta-button primary">
              Get Started
            </Link>
            <Link to="/about" className="cta-button secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <i className="fas fa-graduation-cap"></i>
          <h3>Academic Support</h3>
          <p>Personalized guidance for your academic journey</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-users"></i>
          <h3>Community</h3>
          <p>Connect with peers and mentors</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-lightbulb"></i>
          <h3>Resources</h3>
          <p>Access to valuable academic resources</p>
      </div>
    </section>
    </div>
  );
};

export default Home; 