import Sequelize from 'sequelize';
const { Op, fn, col, literal } = Sequelize;
import Complaint from '../models/complaint.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import Escalation from '../models/escalation.model.js';
import TimelineEvent from '../models/timelineEvent.model.js';
import pkg from 'jspdf';
const { jsPDF } = pkg;
import 'jspdf-autotable';

// --- EXISTING FUNCTIONS ---
export const getAllComplaints = async (req, res) => {
    console.log("✅ Admin: Received request for all complaints.");
    try {
        const { status, category, date } = req.query;
        let where = {};
        if (status && status !== 'All') where.status = status;
        if (category) where.category = category;
        if (date) where.createdAt = { [Op.gte]: new Date(date) };
        console.log("⚙️ Admin: Constructed WHERE clause:", where);
        const complaints = await Complaint.findAll({ where, include: [{ model: User, attributes: ['id', 'name', 'role'] }], order: [['createdAt', 'DESC']] });
        console.log(`👍 Admin: Found ${complaints.length} complaints.`);
        res.status(200).json(complaints);
    } catch (error) {
        console.error("❌ Admin: Error in getAllComplaints:", error);
        res.status(500).json({ message: "Server error while fetching complaints." });
    }
};

export const getAnalytics = async (req, res) => {
    console.log("✅ Admin: Received request for analytics.");
    try {
        const complaintsByCategory = await Complaint.findAll({ attributes: ['category', [fn('COUNT', col('id')), 'value']], group: ['category'], raw: true }).then(data => data.map(item => ({ name: item.category, value: parseInt(item.value, 10) })));
        const complaintsByStatus = await Complaint.findAll({ attributes: ['status', [fn('COUNT', col('id')), 'value']], group: ['status'], raw: true }).then(data => data.map(item => ({ name: item.status, value: parseInt(item.value, 10) })));
        const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyTrendsRaw = await Complaint.findAll({ attributes: [[fn('YEAR', col('createdAt')), 'year'], [fn('MONTH', col('createdAt')), 'month'], [fn('COUNT', col('id')), 'complaints']], where: { createdAt: { [Op.gte]: sixMonthsAgo } }, group: ['year', 'month'], order: [['year', 'ASC'], ['month', 'ASC']], raw: true });
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyTrends = monthlyTrendsRaw.map(item => ({ month: `${monthNames[item.month - 1]} '${String(item.year).slice(-2)}`, complaints: parseInt(item.complaints, 10) }));
        const totalComplaints = await Complaint.count();
        const resolvedComplaints = await Complaint.count({ where: { status: 'Resolved' } });
        const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(0) : 0;
        const avgResolutionTimeResult = await Complaint.findOne({ attributes: [[fn('AVG', literal('DATEDIFF(updatedAt, createdAt)')), 'avgTime']], where: { status: 'Resolved' }, raw: true });
        const avgResolutionTime = avgResolutionTimeResult?.avgTime ? parseFloat(avgResolutionTimeResult.avgTime).toFixed(1) : '0';
        const analyticsPayload = { complaintsByCategory, complaintsByStatus, monthlyTrends, summaryStats: { totalComplaints, avgResolutionTime: `${avgResolutionTime} days`, resolutionRate: `${resolutionRate}%` } };
        console.log("👍 Admin: Successfully generated analytics data.");
        res.status(200).json(analyticsPayload);
    } catch (error) {
        console.error("❌ Admin: Error generating analytics:", error);
        res.status(500).json({ message: "Server error while generating analytics." });
    }
};

export const respondToComplaint = async (req, res) => {
    const { status, response } = req.body; const complaintId = req.params.id; const adminUserId = req.user.id;
    try {
        const complaint = await Complaint.findByPk(complaintId);
        if (complaint) {
            const oldStatus = complaint.status; complaint.status = status; await complaint.save();
            await Comment.create({ message: response, ComplaintId: complaintId, UserId: adminUserId });
            await TimelineEvent.create({ ComplaintId: complaintId, action: 'Admin Responded', details: `Response added by Admin ID ${adminUserId}` });
            if (oldStatus !== status) { await TimelineEvent.create({ ComplaintId: complaintId, action: 'Status Changed', details: `Status changed from ${oldStatus} to ${status} by Admin ID ${adminUserId}` }); }
            const updatedComplaint = await Complaint.findByPk(complaintId, { include: [{ model: User, attributes: ['name', 'role'] }, { model: Comment, include: [{ model: User, attributes: ['name', 'role'] }] }, { model: TimelineEvent }], order: [[Comment, 'createdAt', 'ASC'], [TimelineEvent, 'createdAt', 'ASC']] });
            res.json(updatedComplaint);
        } else { res.status(404).json({ message: 'Complaint not found' }); }
    } catch (error) { console.error("Error responding to complaint:", error); res.status(500).json({ message: "Failed to respond to complaint." }); }
};

// --- ADD export KEYWORD HERE ---
export const escalateComplaintById = async (req, res) => {
    const complaintId = req.params.id;
    const adminUserId = req.user.id;
    try {
        const complaint = await Complaint.findByPk(complaintId);
        if (!complaint) { return res.status(404).json({ message: 'Complaint not found' }); }
        if (complaint.status === 'Escalated' || complaint.status === 'Resolved') { return res.status(400).json({ message: `Complaint is already ${complaint.status}` }); }
        const oldStatus = complaint.status; complaint.status = 'Escalated'; await complaint.save();
        await Escalation.create({ ComplaintId: complaintId });
        await TimelineEvent.create({ ComplaintId: complaintId, action: 'Complaint Escalated', details: `Manually escalated from ${oldStatus} by Admin ID ${adminUserId}` });
        const updatedComplaint = await Complaint.findByPk(complaintId, { include: [{ model: User, attributes: ['name', 'role'] }, { model: Comment, include: [{ model: User, attributes: ['name', 'role'] }] }, { model: TimelineEvent }], order: [[Comment, 'createdAt', 'ASC'], [TimelineEvent, 'createdAt', 'ASC']] });
        res.json(updatedComplaint);
    } catch (error) { console.error("Error escalating complaint:", error); res.status(500).json({ message: "Failed to escalate complaint." }); }
};
// --- END export KEYWORD ADDITION ---


export const exportComplaintsCSV = async (req, res) => {
    console.log("✅ Admin: Received request to export complaints as CSV");
    try {
        const complaints = await Complaint.findAll({
            include: [{ model: User, attributes: ['name', 'role'] }],
            order: [['createdAt', 'DESC']]
        });

        // Create CSV header
        let csv = 'ID,Title,Description,Category,Status,Created By,Created At,Updated At\n';

        // Add data rows
        complaints.forEach(complaint => {
            const row = [
                complaint.id,
                `"${complaint.title.replace(/"/g, '""')}"`,
                `"${complaint.description.replace(/"/g, '""')}"`,
                complaint.category,
                complaint.status,
                complaint.User ? complaint.User.name : 'Unknown',
                new Date(complaint.createdAt).toISOString().split('T')[0],
                new Date(complaint.updatedAt).toISOString().split('T')[0]
            ];
            csv += row.join(',') + '\n';
        });

        // Set response headers
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=complaints.csv');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        
        // Send the CSV data
        res.send(csv);
        console.log("👍 Admin: Successfully exported complaints to CSV");
    } catch (error) {
        console.error("❌ Admin: Error exporting complaints to CSV:", error);
        res.status(500).json({ message: "Failed to export complaints to CSV" });
    }
};

export const exportComplaintsPDF = async (req, res) => {
    console.log("✅ Admin: Received request to export complaints as PDF");
    try {
        const complaints = await Complaint.findAll({
            include: [{ model: User, attributes: ['name', 'role'] }],
            order: [['createdAt', 'DESC']]
        });

        // Create new PDF document
        const doc = new jsPDF();
        
        // Set initial position
        let yPos = 20;
        
        // Add title
        doc.setFontSize(16);
        doc.text('Complaints Report', 15, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, yPos);
        yPos += 15;

        // Add header
        doc.setFontSize(10);
        doc.setTextColor(41, 128, 185);
        const headers = ['ID', 'Title', 'Category', 'Status', 'Created By'];
        const columnWidths = [20, 60, 30, 30, 40];
        let xPos = 15;
        
        // Draw header
        headers.forEach((header, index) => {
            doc.text(header, xPos, yPos);
            xPos += columnWidths[index];
        });
        
        // Reset text color for data
        doc.setTextColor(0, 0, 0);
        yPos += 10;

        // Add data rows
        complaints.forEach((complaint, index) => {
            // Check if we need a new page
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            xPos = 15;
            const rowData = [
                complaint.id.toString(),
                complaint.title.substring(0, 25) + (complaint.title.length > 25 ? '...' : ''),
                complaint.category,
                complaint.status,
                complaint.User ? complaint.User.name : 'Unknown'
            ];

            rowData.forEach((text, colIndex) => {
                doc.text(text.toString(), xPos, yPos);
                xPos += columnWidths[colIndex];
            });

            yPos += 10;
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=complaints.pdf');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        
        // Send the PDF buffer
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
        res.send(pdfBuffer);
        console.log("👍 Admin: Successfully exported complaints to PDF");
    } catch (error) {
        console.error("❌ Admin: Error exporting complaints to PDF:", error);
        res.status(500).json({ message: "Failed to export complaints to PDF" });
    }
};