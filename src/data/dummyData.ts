// src/data/dummyData.ts

// Define TimelineEvent interface
export interface TimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

// Define Comment interface
export interface Comment {
  id: string;
  complaintId: string; // Ensure this matches backend if needed, or remove if just frontend
  author: string;
  role: "User" | "Admin" | "Staff"; // Match roles used in your app
  content: string;
  timestamp: string;
  isInternal?: boolean; // Optional, depending on your backend comment model
  User?: ComplaintUser | null; // Added to match potential backend include
  UserId?: number | null; // Added to match potential backend include
}

// Define the User type expected from the backend within Complaint/Comment
interface ComplaintUser {
  name: string;
  role: 'user' | 'admin';
}

// Define Complaint interface (uses TimelineEvent and Comment)
export interface Complaint {
  id: string | number; // Backend might use number IDs
  title: string;
  category: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  // Update status to match backend ENUM values
  status: "Pending" | "In Progress" | "Resolved" | "Escalated";
  submittedBy?: string; // Keep for dummy data compatibility, backend uses User relation
  submittedAt?: string; // Keep for dummy data, backend uses createdAt
  createdAt: string; // Add createdAt from backend
  updatedAt: string; // Add updatedAt from backend
  assignedTo?: string; // Keep this if you use it, otherwise remove
  resolvedAt?: string;
  attachment?: string | null; // Backend sends a string path or null
  attachments?: string[] | string; // Keep if dummy data uses it, but backend sends 'attachment'
  timeline: TimelineEvent[]; // Now defined
  comments: Comment[]; // Now defined
  User?: ComplaintUser | null; // Add the optional User object from backend include
  UserId?: number | null; // Foreign key from backend
}


// --- DUMMY DATA ---
// (Keep your existing dummyComplaints and analyticsData here)

export const dummyComplaints: Complaint[] = [
  {
    id: "CMP-001",
    title: "Network Connectivity Issues",
    category: "Technical",
    description: "Internet connection keeps dropping every few hours. This is affecting my work productivity significantly.",
    priority: "High",
    status: "In Progress", // Matches backend type
    submittedBy: "John Doe",
    createdAt: "2025-01-15T10:30:00Z", // Use createdAt
    updatedAt: "2025-01-15T11:00:00Z", // Use updatedAt
    assignedTo: "Admin Sarah",
    attachment: "network-log.txt", // Use attachment (string)
    timeline: [
      {
        id: "t1",
        timestamp: "2025-01-15T10:30:00Z",
        action: "Complaint Submitted",
        user: "John Doe",
      },
      {
        id: "t2",
        timestamp: "2025-01-15T11:00:00Z",
        action: "Status Changed to In Progress", // Corrected status
        user: "Admin Sarah",
        details: "Technical team has been notified",
      },
    ],
    comments: [
      {
        id: "c1",
        complaintId: "CMP-001",
        author: "Admin Sarah",
        role: "Admin",
        content: "We're looking into this issue. Can you provide the exact times when the connection drops?",
        timestamp: "2025-01-15T11:15:00Z",
        isInternal: false,
      },
    ],
    User: { name: "John Doe", role: "user" } // Example User data
  },
  // ... (Add createdAt, updatedAt, attachment, User? to other dummy complaints similarly)
  {
    id: "CMP-002",
    title: "Billing Discrepancy",
    category: "Billing",
    description: "I was charged twice for the same service last month. Please investigate and refund the duplicate charge.",
    priority: "Urgent",
    status: "Escalated",
    submittedBy: "Jane Smith",
    createdAt: "2025-01-10T14:20:00Z",
    updatedAt: "2025-01-12T09:00:00Z",
    assignedTo: "Admin Mike",
    attachment: null,
    timeline: [
      { id: "t3", timestamp: "2025-01-10T14:20:00Z", action: "Complaint Submitted", user: "Jane Smith" },
      { id: "t4", timestamp: "2025-01-10T15:00:00Z", action: "Status Changed to In Progress", user: "Admin Mike" },
      { id: "t5", timestamp: "2025-01-12T09:00:00Z", action: "Escalated to Senior Management", user: "System", details: "Complaint pending for more than 48 hours" },
    ],
    comments: [
      { id: "c2", complaintId: "CMP-002", author: "Admin Mike", role: "Admin", content: "We've verified the duplicate charge. Processing refund now.", timestamp: "2025-01-12T10:00:00Z", isInternal: false },
      { id: "c3", complaintId: "CMP-002", author: "Senior Admin", role: "Admin", content: "Refund approved. Will be processed within 3-5 business days.", timestamp: "2025-01-12T14:30:00Z", isInternal: true },
    ],
    User: { name: "Jane Smith", role: "user" }
  },
  {
    id: "CMP-003",
    title: "Poor Customer Service Experience",
    category: "Service",
    description: "The support representative was unhelpful and rude during my last call.",
    priority: "Medium",
    status: "Pending", // Use Pending
    submittedBy: "Robert Brown",
    createdAt: "2025-01-18T09:15:00Z",
    updatedAt: "2025-01-18T09:15:00Z",
    attachment: null,
    timeline: [
        { id: "t6", timestamp: "2025-01-18T09:15:00Z", action: "Complaint Submitted", user: "Robert Brown" },
    ],
    comments: [],
    User: { name: "Robert Brown", role: "user" }
  },
  // ... Add more dummy complaints adapting the structure if needed
];

export const analyticsData = {
  complaintsByCategory: [
    { name: "Technical", value: 45 },
    { name: "Billing", value: 30 },
    { name: "Service", value: 25 },
    { name: "Logistics", value: 20 },
    { name: "Other", value: 15 },
  ],
  complaintsByStatus: [
    { name: "Pending", value: 35 }, // Use Pending
    { name: "In Progress", value: 50 }, // Use In Progress
    { name: "Resolved", value: 80 },
    { name: "Escalated", value: 10 },
  ],
  monthlyTrends: [
    { month: "Sep", complaints: 25 },
    { month: "Oct", complaints: 30 },
    { month: "Nov", complaints: 35 },
    { month: "Dec", complaints: 40 },
    { month: "Jan", complaints: 45 },
  ],
};