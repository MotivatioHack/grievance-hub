import Sequelize from 'sequelize';
const { DataTypes } = Sequelize;
import sequelize from '../config/db.js';
import User from './user.model.js';

const Complaint = sequelize.define('Complaint', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  attachment: {
    type: DataTypes.STRING,
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Medium',
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved', 'Escalated'),
    defaultValue: 'Pending',
  },
});

User.hasMany(Complaint);
Complaint.belongsTo(User);

export default Complaint;