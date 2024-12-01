import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For API requests

const HomePage = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]); // State for tasks fetched from the backend
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [todayProgress, setTodayProgress] = useState({ completed: 0, total: 0 });
  const [weeklyProgress, setWeeklyProgress] = useState({ completed: 0, total: 0 });

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks"); // Update URL as needed
        setTasks(response.data); // Assuming backend returns an array of tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Update task progress and filters based on fetched tasks
  useEffect(() => {
    if (tasks.length === 0) return;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    let completedToday = 0;
    let totalToday = 0;
    let completedWeekly = 0;
    let totalWeekly = 0;
    const upcoming = [];
    const overdue = [];

    tasks.forEach((task) => {
      const dueDate = new Date(task.dueDate);
      if (dueDate < today && !task.completed) {
        overdue.push(task);
      } else if (dueDate >= today && dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
        upcoming.push(task);
      }

      if (dueDate.toDateString() === today.toDateString()) {
        totalToday++;
        if (task.completed) completedToday++;
      }

      if (dueDate >= startOfWeek && dueDate <= today) {
        totalWeekly++;
        if (task.completed) completedWeekly++;
      }
    });

    setOverdueTasks(overdue);
    setUpcomingTasks(upcoming);
    setTodayProgress({ completed: completedToday, total: totalToday });
    setWeeklyProgress({ completed: completedWeekly, total: totalWeekly });
  }, [tasks]);

  return (
    <div className="homepage">
      <div className="welcome-section">
        <h2>Welcome to Your Task Manager!</h2>
        <p>Organize your tasks, track progress, and stay productive.</p>
      </div>

      <div className="summary-section">
        <h3>Today's Summary:</h3>
        {todayProgress.total > 0 ? (
          <p>
            Completed: {todayProgress.completed} / {todayProgress.total} tasks
          </p>
        ) : (
          <p>No tasks scheduled for today. Enjoy your day!</p>
        )}
      </div>

      <div className="summary-section">
        <h3>Weekly Summary:</h3>
        {weeklyProgress.total > 0 ? (
          <p>
            Completed: {weeklyProgress.completed} / {weeklyProgress.total} tasks
          </p>
        ) : (
          <p>No tasks scheduled for this week. Plan something exciting!</p>
        )}
      </div>

      <div className="tasks-section">
        <div>
          <h3>Overdue Tasks:</h3>
          {overdueTasks.length > 0 ? (
            <ul className="task-list">
              {overdueTasks.map((task) => (
                <li key={task._id} onClick={() => navigate("/tasks", { state: { taskId: task._id } })}>
                  {task.name} (Due: {new Date(task.dueDate).toLocaleDateString()})
                </li>
              ))}
            </ul>
          ) : (
            <p>No overdue tasks. Great job staying on track!</p>
          )}
        </div>

        <div>
          <h3>Upcoming Tasks:</h3>
          {upcomingTasks.length > 0 ? (
            <ul className="task-list">
              {upcomingTasks.map((task) => (
                <li key={task._id} onClick={() => navigate("/tasks", { state: { taskId: task._id } })}>
                  {task.name} (Due: {new Date(task.dueDate).toLocaleDateString()})
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming tasks. Add some new tasks to stay productive!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
