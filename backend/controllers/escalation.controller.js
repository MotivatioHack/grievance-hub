import Complaint from '../models/complaint.model.js';
import Escalation from '../models/escalation.model.js';
import Sequelize from 'sequelize';
const { Op, fn, col, literal } = Sequelize;

export const escalateComplaints = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const complaintsToEscalate = await Complaint.findAll({
    where: {
      status: {
        [Op.not]: 'Resolved',
      },
      createdAt: {
        [Op.lte]: threeDaysAgo,
      },
    },
  });

  for (const complaint of complaintsToEscalate) {
    complaint.status = 'Escalated';
    await complaint.save();
    await Escalation.create({ ComplaintId: complaint.id });
  }
};