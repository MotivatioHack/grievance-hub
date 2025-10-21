import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { FileText, Clock, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Complaint } from "@/data/dummyData";

// --- HELPER FUNCTIONS (Outside Component with explicit types) ---
const getPriorityColor = (priority?: Complaint['priority']): string => { // Added return type annotation
    switch (priority) {
        case "Urgent": return "text-red-500";
        case "High": return "text-orange-500";
        case "Medium": return "text-yellow-500";
        case "Low": return "text-green-500";
        default: return "text-muted-foreground";
    }
};

const getStatusClass = (status?: Complaint['status']): string => { // Added return type annotation
    switch (status) {
        case "Resolved": return "bg-green-500/20 text-green-400";
        case "Escalated": return "bg-red-500/20 text-red-400";
        case "In Progress": return "bg-yellow-500/20 text-yellow-400";
        case "Pending":
        default: return "bg-blue-500/20 text-blue-400";
    }
};

const isOverdue = (createdAt?: string): boolean => { // Added return type annotation
    if (!createdAt) return false;
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    try {
        // Ensure valid date comparison
        return !isNaN(new Date(createdAt).getTime()) && new Date(createdAt) < threeDaysAgo;
    } catch (e) {
        console.error("Error parsing date in isOverdue:", createdAt, e);
        return false; // Return false if date is invalid
    }
};
// --- END HELPER FUNCTIONS ---

const AdminDashboard = () => {
  const userString = localStorage.getItem("user");
  const parsedUser = userString ? JSON.parse(userString) : null;

  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  // Fetch Logic (remains the same)
  const fetchComplaints = useCallback(async () => {
    // ... (keep fetch logic as before) ...
    if (!parsedUser?.token) { setError("Admin user not found or token missing."); setLoading(false); setAllComplaints([]); setFilteredComplaints([]); return; }
    setLoading(true); setError(null);
    console.log("Attempting to fetch admin complaints...");
    try {
      const response = await fetch("http://localhost:5000/api/admin/complaints", { method: "GET", headers: { Authorization: `Bearer ${parsedUser.token}` } });
      console.log("Fetch response status:", response.status);
      if (!response.ok) { let errorMsg = `HTTP error! Status: ${response.status}`; try { const d = await response.json(); errorMsg = d.message || errorMsg; } catch (e) { /* ignore */ } console.error("Fetch error response:", errorMsg); throw new Error(errorMsg); }
      const data: Complaint[] = await response.json();
      console.log("Successfully fetched admin complaints:", data.length);
      setAllComplaints(data);
    } catch (err: any) { console.error("Fetch admin complaints failed:", err); setError(err.message || "Could not load complaints."); toast.error(err.message || "Could not load complaints."); setAllComplaints([]); }
    finally { console.log("Finished fetching admin complaints, setting loading to false."); setLoading(false); }
  }, [parsedUser?.token]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  // Filtering Logic (remains the same)
  useEffect(() => {
    if (filter === "All") { setFilteredComplaints(allComplaints); }
    else { setFilteredComplaints(allComplaints.filter(c => c.status === filter)); }
  }, [filter, allComplaints]);

  if (!userString || parsedUser?.role !== "Admin") { return <Navigate to="/login" />; }

  // Stats Calculation (remains the same)
  const totalComplaintsCount = allComplaints.length;
  const pendingInProgressCount = allComplaints.filter(c => c.status === "Pending" || c.status === "In Progress").length;
  const resolvedCount = allComplaints.filter(c => c.status === "Resolved").length;
  const escalatedCount = allComplaints.filter(c => c.status === "Escalated").length;
  const stats = [ /* ...stats array remains the same... */
    { label: "Total Complaints", value: totalComplaintsCount, icon: FileText, color: "text-neon-cyan" },
    { label: "Pending/In Progress", value: pendingInProgressCount, icon: Clock, color: "text-neon-purple" },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle, color: "text-green-500" },
    { label: "Escalated", value: escalatedCount, icon: AlertCircle, color: "text-neon-pink" },
  ];

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} >
          {/* Header Section (remains the same) */}
           <div className="flex justify-between items-center mb-8">
             <div><h1 className="text-4xl font-bold neon-text mb-2">Admin Dashboard</h1><p className="text-muted-foreground">Manage and respond to complaints</p></div>
             <Link to="/admin/analytics"><Button className="bg-primary hover:neon-glow"><BarChart3 className="mr-2" size={18} /> View Analytics</Button></Link>
           </div>

          {/* Stats Section (remains the same) */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                 <GlassCard>
                   <div className="flex items-center justify-between">
                     <div><p className="text-sm text-muted-foreground">{stat.label}</p><p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p></div>
                     <stat.icon className={stat.color} size={32} />
                   </div>
                 </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Filters Section (remains the same) */}
           <div className="flex gap-2 mb-6 flex-wrap">
             {["All", "Pending", "In Progress", "Escalated", "Resolved"].map((status) => (
               <Button key={status} variant={filter === status ? "default" : "outline"} onClick={() => setFilter(status)} className={filter === status ? "bg-primary" : ""}>{status}</Button>
             ))}
           </div>

          {/* Complaints List Section */}
          <div className="space-y-4">
            {loading ? (
                 <GlassCard><p className="text-muted-foreground text-center p-4">Loading complaints...</p></GlassCard>
            ) : error ? (
                 <GlassCard><p className="text-red-500 text-center p-4">Error loading complaints: {error}</p></GlassCard>
            ) : filteredComplaints.length === 0 ? (
                 <GlassCard><p className="text-muted-foreground text-center p-4">No complaints {filter === 'All' ? 'found' : `match the filter: ${filter}`}.</p></GlassCard>
            ) : (
                // --- REFINED MAPPING LOGIC ---
                filteredComplaints.map((complaint, index) => {
                    // Pre-calculate values safely
                    const priorityClass = getPriorityColor(complaint.priority); // Call function directly
                    const statusClass = getStatusClass(complaint.status); // Call function directly
                    const overdueCheck = isOverdue(complaint.createdAt); // Call function directly
                    const submittedDate = complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A';
                    const submittedBy = complaint.User?.name || 'Anonymous';
                    const key = `complaint-${complaint.id || index}`;

                    return (
                        <motion.div key={key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} >
                            <GlassCard hover>
                            <Link to={`/admin/complaint/${complaint.id}`}>
                                <div className="flex items-start justify-between">
                                {/* Complaint Details */}
                                <div className="flex-1 mr-4 min-w-0">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="text-xl font-semibold truncate">{complaint.title || 'No Title'}</h3>
                                        <span className={`text-sm font-medium ${priorityClass}`}>{complaint.priority || 'N/A'}</span>
                                        {/* Use the pre-calculated boolean directly */}
                                        {overdueCheck && complaint.status !== "Resolved" ? (
                                            <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded animate-pulse">OVERDUE</span>
                                        ) : null} {/* Render null if condition is false */}
                                    </div>
                                    <p className="text-muted-foreground mb-2 line-clamp-2">{complaint.description || 'No Description'}</p>
                                    <div className="flex items-center gap-x-4 gap-y-1 text-sm text-muted-foreground flex-wrap">
                                        <span>ID: {complaint.id}</span>
                                        <span>Category: {complaint.category || 'N/A'}</span>
                                        <span>By: {submittedBy}</span>
                                        <span>Submitted: {submittedDate}</span>
                                        {/* Standard truthiness check is fine here, render null if false */}
                                        {complaint.assignedTo ? <span>Assigned: {complaint.assignedTo}</span> : null}
                                    </div>
                                </div>
                                {/* Status & Action */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>{complaint.status || 'N/A'}</span>
                                    <Button variant="outline" size="sm" className="border-neon-cyan text-xs">View & Respond</Button>
                                </div>
                                </div>
                            </Link>
                            </GlassCard>
                        </motion.div>
                    );
                })
                // --- END REFINED MAPPING LOGIC ---
            )}
          </div>
        </motion.div>
      </main>
  );
};

export default AdminDashboard;