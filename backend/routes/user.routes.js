import express from 'express';
import { getMyComplaints, addComment } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Add express.json() middleware for this route
router.use(express.json());

router.route('/complaints').get(protect, getMyComplaints);
router.route('/complaints/:id/comments').post(protect, addComment);

export default router;