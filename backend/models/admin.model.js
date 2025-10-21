import Sequelize from 'sequelize';
const { DataTypes } = Sequelize;
import sequelize from '../config/db.js';
import Complaint from './complaint.model.js';

const Escalation = sequelize.define('Escalation', {
  escalationLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  escalatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Complaint.hasMany(Escalation);
Escalation.belongsTo(Complaint);

export default Escalation;