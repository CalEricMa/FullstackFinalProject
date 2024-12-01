import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    dueDate: "",
    description: "",
    completed: false,
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if data already exists to prevent redundant fetches
    if (projects.length === 0) {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingProjectId(null);
    setNewProject({
      name: "",
      dueDate: "",
      description: "",
      completed: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        dueDate: newProject.dueDate,
        completed: newProject.completed,
      };

      if (editingProjectId) {
        const response = await axios.put(
          `http://localhost:5000/api/projects/${editingProjectId}`,
          projectData
        );
        setProjects((prev) =>
          prev.map((project) =>
            project.id === editingProjectId ? response.data : project
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/projects",
          projectData
        );
        setProjects((prev) => [...prev, response.data]);
      }

      toggleForm();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEdit = (project) => {
    setEditingProjectId(project.id);
    setNewProject(project);
    setShowForm(true);
  };

  const toggleCompleted = async (project) => {
    try {
      const updatedProject = { ...project, completed: !project.completed };
      const response = await axios.put(
        `http://localhost:5000/api/projects/${project.id}`,
        updatedProject
      );
      setProjects((prev) =>
        prev.map((proj) => (proj.id === project.id ? response.data : proj))
      );
    } catch (error) {
      console.error("Error toggling completed:", error);
    }
  };

  return (
    <div className="projects-page">
      <div className="welcome-section">
        <h2>Projects Management</h2>
        <p>View, edit, and organize your projects below.</p>
      </div>

      <div className="summary-section">
        <button className="add-project-button" onClick={toggleForm}>
          {editingProjectId ? "Cancel Edit" : "Add Project"}
        </button>
        {showForm && (
          <form className="project-form" onSubmit={handleSubmit}>
            <label>
              Project Name:
              <input
                type="text"
                name="name"
                value={newProject.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Due Date:
              <input
                type="date"
                name="dueDate"
                value={newProject.dueDate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={newProject.description}
                onChange={handleChange}
              />
            </label>
            <button type="submit">
              {editingProjectId ? "Update Project" : "Create Project"}
            </button>
          </form>
        )}
      </div>

      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              className={`project-card ${
                project.completed ? "project-completed" : ""
              }`}
              key={project.id}
            >
              <h3>
                <input
                  type="checkbox"
                  checked={project.completed}
                  onChange={() => toggleCompleted(project)}
                />
                {project.name}
              </h3>
              <p>Due: {project.dueDate}</p>
              <p>{project.description}</p>
              <div className="project-controls">
                <button
                  className="view-tasks-button"
                  onClick={() =>
                    navigate("/tasks", { state: { projectId: project.id } })
                  }
                >
                  View Tasks
                </button>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No projects yet. Add a new project to get started!</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
