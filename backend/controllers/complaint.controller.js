// backend/controllers/complaint.controller.js
import Complaint from '../models/complaint.model.js';
import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';
import TimelineEvent from '../models/timelineEvent.model.js'; // Import the new model
import { validationResult } from 'express-validator';

export const createComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, category, description, priority } = req.body;
  const attachment = req.file ? req.file.path : null;
  const userId = req.user ? req.user.id : null; // Get user ID or null

  try {
    const complaint = await Complaint.create({
      title,
      category,
      description,
      priority,
      attachment,
      UserId: userId,
    });

    // --- Add Timeline Event ---
    await TimelineEvent.create({
        ComplaintId: complaint.id,
        action: 'Complaint Submitted',
        details: `Submitted ${userId ? `by User ID ${userId}` : 'anonymously'}`
        // userId: userId // Uncomment if you added userId to the TimelineEvent model
    });
    // --- End Timeline Event ---

    res.status(201).json(complaint);
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Failed to save complaint to the database." });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name', 'role'] }, // User who submitted
        {
          model: Comment,
          include: [{ model: User, attributes: ['name', 'role'] }], // Comments and their authors
        },
        { model: TimelineEvent } // --- Include Timeline Events ---
        // Optional: If linking TimelineEvent to User
        // { model: TimelineEvent, include: [{ model: User, attributes: ['name'] }] }
      ],
      order: [ // Optional: Order comments and timeline events
        [Comment, 'createdAt', 'ASC'],
        [TimelineEvent, 'createdAt', 'ASC'] // Use Sequelize's createdAt
      ]
    });

    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ message: "Server error while fetching complaint." });
  }
};