const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./taskManager.db",
});

// Models
const Project = sequelize.define("Project", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  dueDate: { type: DataTypes.DATE, allowNull: true },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Task = sequelize.define("Task", {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: true },
  dueDate: { type: DataTypes.DATE, allowNull: true },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Project.hasMany(Task, { as: "tasks", foreignKey: "ProjectId" });
Task.belongsTo(Project, { foreignKey: "ProjectId" });

// Routes

// Fetch all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: { model: Task, as: "tasks" },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Add a new project
app.post("/api/projects", async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;
    const newProject = await Project.create({ name, description, dueDate });
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Fetch tasks for a specific project
app.get("/api/projects/:projectId/tasks", async (req, res) => {
  const { projectId } = req.params;
  try {
    const tasks = await Task.findAll({ where: { ProjectId: projectId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add a new task to a specific project
app.post("/api/projects/:projectId/tasks", async (req, res) => {
  const { projectId } = req.params;
  const { name, type, dueDate, completed } = req.body;
  try {
    const newTask = await Task.create({
      name,
      type,
      dueDate,
      completed,
      ProjectId: projectId,
    });
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
