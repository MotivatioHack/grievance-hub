// backend/models/timelineEvent.model.js
import Sequelize from 'sequelize';
const { DataTypes } = Sequelize;
import sequelize from '../config/db.js';
import Complaint from './complaint.model.js';
import User from './user.model.js'; // Optional: If you want to link events to the user who triggered them

const TimelineEvent = sequelize.define('TimelineEvent', {
  action: { // e.g., "Complaint Created", "Status Changed", "Comment Added"
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: { // Optional details, e.g., "Status changed to In Progress by Admin"
    type: DataTypes.STRING,
  },
  timestamp: { // Use Sequelize's default createdAt instead? Or specific event time?
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Optional: Link the event to the user who performed the action
  // userId: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: User,
  //     key: 'id'
  //   }
  // }
});

// Define Associations
Complaint.hasMany(TimelineEvent);
TimelineEvent.belongsTo(Complaint);

// Optional: If linking to User
// User.hasMany(TimelineEvent);
// TimelineEvent.belongsTo(User);

export default TimelineEvent;