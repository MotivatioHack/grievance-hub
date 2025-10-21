import express from 'express';
import {
  getAllComplaints,
  respondToComplaint,
  getAnalytics,
  escalateComplaintById,
  exportComplaintsCSV,  // Import CSV handler
  exportComplaintsPDF,  // Import PDF handler
} from '../controllers/admin.controller.js';
import { protect, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// This middleware applies to all routes, but export routes don't need a JSON body
// We will apply express.json() only where needed
router.use(protect, isAdmin); 

// Routes that expect JSON body
router.put('/complaints/:id/respond', express.json(), respondToComplaint);
router.put('/complaints/:id/escalate', express.json(), escalateComplaintById);

// Routes that don't need a JSON body
router.get('/complaints', getAllComplaints);
router.get('/analytics', getAnalytics);

// --- ADD EXPORT ROUTES ---
router.get('/complaints/export/csv', exportComplaintsCSV);
router.get('/complaints/export/pdf', exportComplaintsPDF);
// --- END EXPORT ROUTES ---

export default router;
