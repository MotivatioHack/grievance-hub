import Sequelize from 'sequelize';
const { DataTypes } = Sequelize;
import sequelize from '../config/db.js';
import User from './user.model.js';
import Complaint from './complaint.model.js';

const Comment = sequelize.define('Comment', {
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

User.hasMany(Comment);
Comment.belongsTo(User);

Complaint.hasMany(Comment);
Comment.belongsTo(Complaint);

export default Comment;