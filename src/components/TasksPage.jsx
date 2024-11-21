import React from 'react';
import './TasksPage.css'; // Optional for styling

const TasksPage = () => {
  return (
    <div className="tasks-page">
      <h2>Tasks</h2>
      <button className="add-task-button">Add Task</button>
      
      <div className="task-controls">
        <select className="filter-select">
          <option>Filter By</option>
        </select>
        <select className="sort-select">
          <option>Sort By</option>
        </select>
      </div>
      
      <table className="task-table">
        <thead>
          <tr>
            <th>Assignment Type</th>
            <th>Name</th>
            <th>Project</th>
            <th>Due Date</th>
            <th>Complete</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>[Placeholder]</td>
            <td>[Placeholder]</td>
            <td>[Placeholder]</td>
            <td>[Placeholder]</td>
            <td>[Placeholder]</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TasksPage;
