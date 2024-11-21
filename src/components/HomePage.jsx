import React from 'react';
import './HomePage.css'; // Optional for styling

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="summary-section">
        <h3>Today's Summary:</h3>
        <div className="summary-grid">
          <div className="placeholder">[Chart Placeholder]</div>
          <div className="placeholder">Progress Chart</div>
        </div>
      </div>

      <div className="summary-section">
        <h3>Weekly Summary:</h3>
        <div className="summary-grid">
          <div className="placeholder">[Chart Placeholder]</div>
          <div className="placeholder">Progress Chart</div>
        </div>
      </div>

      <div className="tasks-section">
        <div>
          <h3>Overdue Tasks:</h3>
          <ul className="task-list">
            <li>[Task Placeholder]</li>
            <li>[Task Placeholder]</li>
            <li>[Task Placeholder]</li>
          </ul>
        </div>

        <div>
          <h3>Upcoming Tasks:</h3>
          <ul className="task-list">
            <li>[Task Placeholder]</li>
            <li>[Task Placeholder]</li>
            <li>[Task Placeholder]</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
