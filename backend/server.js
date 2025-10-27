import app from './app.js';
import sequelize from './config/db.js';
import cron from 'node-cron';
import { escalateComplaints } from './controllers/escalation.controller.js';

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
  console.log('🧠 DATABASE LINK ESTABLISHED ...');
  app.listen(PORT, () => {
    console.log(`⚡ GRIEVANCEHUB SERVER ONLINE ${PORT}`);
  });
});

// Schedule cron job to run every day at midnight to check for complaints to escalate
cron.schedule('0 0 * * *', () => {
  console.log('Running cron job to escalate complaints...');
  escalateComplaints();
});