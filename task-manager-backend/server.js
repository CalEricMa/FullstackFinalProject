const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const PORT = 5011;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sequelize setup
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./taskManager.db",
});

// Models
const Task = sequelize.define("Task", {
  name: { type: DataTypes.STRING, allowNull: false },
  dueDate: { type: DataTypes.DATE, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Project = sequelize.define("Project", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  dueDate: { type: DataTypes.DATE, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Project.hasMany(Task, { as: "tasks", foreignKey: "ProjectId" });
Task.belongsTo(Project, { foreignKey: "ProjectId" });

// API Endpoints

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

// Update a project
app.put("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, dueDate, completed } = req.body;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.name = name;
    project.description = description;
    project.dueDate = dueDate;
    project.completed = completed;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Delete a project
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.destroy();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Fetch tasks for a specific project
app.get("/api/projects/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId, {
      include: { model: Task, as: "tasks" },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project.tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add a task to a specific project
app.post("/api/projects/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, dueDate, completed } = req.body;
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const newTask = await Task.create({ name, dueDate, completed, ProjectId: projectId });
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Update a specific task
app.put("/api/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { name, dueDate, completed } = req.body;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.name = name;
    task.dueDate = dueDate;
    task.completed = completed;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a specific task
app.delete("/api/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Start the server
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
