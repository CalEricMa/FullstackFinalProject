import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="welcome-section">
        <h1>Welcome to Your Task Manager!</h1>
        <p>
          Effortlessly organize your projects, manage tasks, and stay productive.
        </p>
        <button className="get-started-button" onClick={() => navigate("/projects")}>
          Get Started
        </button>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Manage Projects</h3>
            <p>Create and manage multiple projects with ease.</p>
          </div>
          <div className="feature-card">
            <h3>Track Tasks</h3>
            <p>Keep track of tasks for each project and stay organized.</p>
          </div>
          <div className="feature-card">
            <h3>Deadlines Made Easy</h3>
            <p>Set deadlines and never miss an important task again.</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Start Managing Your Tasks Today</h2>
        <button className="get-started-button" onClick={() => navigate("/projects")}>
          View Projects
        </button>
      </div>
    </div>
  );
};

export default HomePage;
