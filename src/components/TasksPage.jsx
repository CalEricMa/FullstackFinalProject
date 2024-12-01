import React, { useState } from "react";
import "./TasksPage.css";

const TasksPage = ({ tasks = [], projectId }) => {
  const [taskList, setTaskList] = useState(tasks); // Manage tasks
  const [filteredTasks, setFilteredTasks] = useState(tasks); // Filtered and sorted tasks
  const [filter, setFilter] = useState(""); // Filter criteria
  const [sort, setSort] = useState(""); // Sort criteria
  const [showForm, setShowForm] = useState(false); // Toggle task form
  const [newTask, setNewTask] = useState({
    type: "",
    name: "",
    project: projectId || "General",
    dueDate: "",
    completed: false,
  });
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingTaskIndex(null);
    setNewTask({
      type: "",
      name: "",
      project: projectId || "General",
      dueDate: "",
      completed: false,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedTasks;
    if (editingTaskIndex !== null) {
      updatedTasks = [...taskList];
      updatedTasks[editingTaskIndex] = newTask;
    } else {
      updatedTasks = [...taskList, newTask];
    }
    setTaskList(updatedTasks);
    applyFiltersAndSorting(updatedTasks, filter, sort);
    toggleForm();
  };

  const handleDelete = (index) => {
    const updatedTasks = taskList.filter((_, i) => i !== index);
    setTaskList(updatedTasks);
    applyFiltersAndSorting(updatedTasks, filter, sort);
  };

  const handleEdit = (index) => {
    setEditingTaskIndex(index);
    setNewTask(taskList[index]);
    setShowForm(true);
  };

  const toggleCompletion = (index) => {
    const updatedTasks = [...taskList];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTaskList(updatedTasks);
    applyFiltersAndSorting(updatedTasks, filter, sort);
  };

  const applyFiltersAndSorting = (tasks, filterCriteria, sortCriteria) => {
    let updatedTasks = [...tasks];

    if (filterCriteria === "completed") {
      updatedTasks = updatedTasks.filter((task) => task.completed);
    } else if (filterCriteria === "incomplete") {
      updatedTasks = updatedTasks.filter((task) => !task.completed);
    }

    if (sortCriteria === "dueDate") {
      updatedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortCriteria === "name") {
      updatedTasks.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredTasks(updatedTasks);
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    applyFiltersAndSorting(taskList, newFilter, sort);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    applyFiltersAndSorting(taskList, filter, newSort);
  };

  return (
    <div className="tasks-page">
      <div className="welcome-section">
        <h2>Tasks Management</h2>
        <p>View, edit, and organize your tasks below.</p>
      </div>

      <div className="summary-section">
        <button className="add-task-button" onClick={toggleForm}>
          {editingTaskIndex !== null ? "Cancel Edit" : "Add Task"}
        </button>
        {showForm && (
          <form className="task-form" onSubmit={handleSubmit}>
            <label>
              Assignment Type:
              <input
                type="text"
                name="type"
                value={newTask.type}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Project:
              <input
                type="text"
                name="project"
                value={newTask.project}
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
              {editingTaskIndex !== null ? "Update Task" : "Create Task"}
            </button>
          </form>
        )}
      </div>

      <div className="task-controls">
        <select
          className="filter-select"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="">Filter By</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <select className="sort-select" value={sort} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="dueDate">Due Date</option>
          <option value="name">Name</option>
        </select>
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th>Completed</th>
            <th>Task Name</th>
            <th>Type</th>
            <th>Project</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={index} className={task.completed ? "task-completed" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(index)}
                />
              </td>
              <td>{task.name}</td>
              <td>{task.type}</td>
              <td>{task.project}</td>
              <td>{task.dueDate}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(index)}
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

export default TasksPage;
