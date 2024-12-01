const express = require('express');
const sequelize = require('./models/db');
const Project = require('./models/Project');
const Task = require('./models/Task');

const app = express();
app.use(express.json());

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Routes
app.get('/api/projects', async (req, res) => {
  const projects = await Project.findAll({ include: Task });
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const project = await Project.create(req.body);
  res.json(project);
});

app.delete('/api/projects/:id', async (req, res) => {
  await Project.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Project deleted' });
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
