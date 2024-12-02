import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProjectsPage from './components/ProjectsPage';
import ProjectTasksPage  from './components/ProjectTasksPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId/tasks" element={<ProjectTasksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
