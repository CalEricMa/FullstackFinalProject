import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProjectTasksPage.css";

const ProjectTasksPage = () => {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    dueDate: "",
    completed: false,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5011/api/projects/${projectId}/tasks`
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  const toggleForm = () => {
    setShowForm(!showForm);
    setNewTask({
      name: "",
      dueDate: "",
      completed: false,
    });
    setEditingTaskId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        const response = await axios.put(
          `http://localhost:5011/api/tasks/${editingTaskId}`,
          newTask
        );
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTaskId ? response.data : task
          )
        );
      } else {
        const response = await axios.post(
          `http://localhost:5011/api/projects/${projectId}/tasks`,
          newTask
        );
        setTasks((prev) => [...prev, response.data]);
      }
      toggleForm();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5011/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleCompletion = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const response = await axios.put(
        `http://localhost:5011/api/tasks/${task.id}`,
        updatedTask
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? response.data : t))
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setNewTask(task);
    setShowForm(true);
  };

  const applyFiltersAndSorting = () => {
    let filteredTasks = [...tasks];

    if (filter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    } else if (filter === "incomplete") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    }

    if (sort === "dueDate") {
      filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sort === "name") {
      filteredTasks.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filteredTasks;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date to MM/DD/YYYY by default
  };

  return (
    <div className="tasks-page">
      <div className="welcome-section">
        <h2>Tasks for Project {projectId}</h2>
      </div>

      <div className="task-controls">
        <button className="add-task-button" onClick={toggleForm}>
          {editingTaskId ? "Cancel Edit" : "Add Task"}
        </button>
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Filter By</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="dueDate">Due Date</option>
          <option value="name">Name</option>
        </select>
      </div>

      {showForm && (
        <form className="project-form" onSubmit={handleSubmit}>
          <label>
            Task Name:
            <input
              type="text"
              name="name"
              value={newTask.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Due Date:
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">
            {editingTaskId ? "Update Task" : "Create Task"}
          </button>
        </form>
      )}

      <table className="tasks-table">
        <thead>
          <tr>
            <th>Completed</th>
            <th>Task Name</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applyFiltersAndSorting().map((task) => (
            <tr key={task.id} className={task.completed ? "task-completed" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task)}
                />
              </td>
              <td>{task.name}</td>
              <td>{formatDate(task.dueDate)}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTasksPage;
