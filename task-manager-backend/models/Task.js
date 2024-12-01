const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Project = require('./Project');

const Task = sequelize.define('Task', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Define relationship
Task.belongsTo(Project);
Project.hasMany(Task);

module.exports = Task;
