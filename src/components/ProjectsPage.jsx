import React from 'react';
import './ProjectsPage.css'; // Optional for styling

const ProjectsPage = () => {
  return (
    <div className="projects-page">
      <h2>Projects</h2>
      <button className="add-project-button">Add Project</button>
      
      <div className="projects-grid">
        <div className="project-card">
          <h3>Project Name</h3>
          <p>Due: [Placeholder]</p>
          <ul>
            <li>Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
          </ul>
        </div>
        <div className="project-card">
          <h3>Project Name</h3>
          <p>Due: [Placeholder]</p>
          <ul>
            <li>Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
