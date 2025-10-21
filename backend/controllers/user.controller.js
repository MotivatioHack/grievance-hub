// backend/controllers/user.controller.js
import Complaint from '../models/complaint.model.js';
import Comment from '../models/comment.model.js';
import TimelineEvent from '../models/timelineEvent.model.js'; // Import

export const getMyComplaints = async (req, res) => {
  // ... (keep existing code)
  try {
    const complaints = await Complaint.findAll({ where: { UserId: req.user.id } });
    res.json(complaints);
  } catch (error) {
     console.error("Error fetching user complaints:", error);
     res.status(500).json({ message: "Failed to fetch complaints." });
  }
};

export const addComment = async (req, res) => {
    const { message } = req.body;
    const complaintId = req.params.id;
    const userId = req.user.id;

    try {
        const complaint = await Complaint.findByPk(complaintId);

        // Check if complaint exists and if user is authorized (owner or admin - adjust logic if needed)
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        if (complaint.UserId !== userId && req.user.role !== 'admin') {
             return res.status(403).json({ message: 'Not authorized to comment on this complaint' });
        }

        const comment = await Comment.create({
            message,
            ComplaintId: complaintId,
            UserId: userId
        });

        // --- Add Timeline Event ---
        await TimelineEvent.create({
            ComplaintId: complaintId,
            action: 'Comment Added',
            details: `Comment added by ${req.user.role} ID ${userId}`
            // userId: userId // Uncomment if linking events to users
        });
        // --- End Timeline Event ---

        res.status(201).json(comment); // Send back the created comment
   } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment." });
   }
};