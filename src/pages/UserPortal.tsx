import { useState, useEffect, useCallback } from "react"; // Import useCallback
import { motion } from "framer-motion";
import { Link, Navigate, useLocation } from "react-router-dom"; // Import useLocation
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Complaint } from "@/data/dummyData";

const UserPortal = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get location object

  // --- Wrap fetch logic in useCallback ---
  const fetchComplaints = useCallback(async () => {
    if (!user?.token) {
      setLoading(false);
      setUserComplaints([]); // Ensure complaints are cleared if no token
      return;
    }

    // console.log("Fetching complaints..."); // Add log
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users/complaints", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch complaints");
      }

      const data: Complaint[] = await response.json();
      // console.log("Fetched data:", data); // Add log
      setUserComplaints(data);
    } catch (error: any) {
      // console.error("Fetch error:", error); // Add log
      toast.error(error.message || "Could not load your complaints.");
      setUserComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [user?.token]); // Dependency: only the token

  // --- useEffect to fetch on mount and location change ---
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints, location.key]); // Re-run when fetch function or location changes


  if (!user) return <Navigate to="/login" />;

  // --- Helper Functions (keep these as they are) ---
  const getStatusIcon = (status: Complaint['status']) => {
    switch (status) {
      case "Pending": return <AlertCircle className="text-neon-cyan" />;
      case "In Progress": return <Clock className="text-neon-purple" />;
      case "Resolved": return <CheckCircle className="text-green-500" />;
      case "Escalated": return <AlertCircle className="text-neon-pink" />;
      default: return <FileText />;
    }
  };

  const getPriorityColor = (priority: Complaint['priority']) => {
    switch (priority) {
      case "Urgent": return "text-red-500";
      case "High": return "text-orange-500";
      case "Medium": return "text-yellow-500";
      case "Low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusClass = (status: Complaint['status']) => {
    switch (status) {
      case "Resolved": return "bg-green-500/20 text-green-400";
      case "Escalated": return "bg-red-500/20 text-red-400";
      case "In Progress": return "bg-yellow-500/20 text-yellow-400";
      case "Pending":
      default: return "bg-blue-500/20 text-blue-400";
    }
  };
  // --- End Helper Functions ---

    // --- Stats Calculation (runs on every render based on current userComplaints) ---
  const totalComplaintsCount = userComplaints.length;
  const pendingInProgressCount = userComplaints.filter(c => c.status === "Pending" || c.status === "In Progress").length;
  const resolvedCount = userComplaints.filter(c => c.status === "Resolved").length;
  const escalatedCount = userComplaints.filter(c => c.status === "Escalated").length;

  const stats = [
    { label: "Total Complaints", value: totalComplaintsCount, icon: FileText },
    { label: "Pending/Review", value: pendingInProgressCount, icon: Clock },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle },
    { label: "Escalated", value: escalatedCount, icon: AlertCircle },
  ];
  // --- End Stats Calculation ---


  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold neon-text mb-2">User Portal</h1>
            <p className="text-muted-foreground">Manage your complaints and track their progress</p>
          </div>
          <Link to="/portal/submit">
            <Button className="bg-primary hover:neon-glow">
              <FileText className="mr-2" size={18} />
              Submit New Complaint
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-neon-cyan">{stat.value}</p>
                  </div>
                  <stat.icon className="text-primary" size={32} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Your Complaints</h2>
          {loading ? (
            <GlassCard><p className="text-muted-foreground text-center p-4">Loading complaints...</p></GlassCard>
          ) : userComplaints.length === 0 ? (
            <GlassCard><p className="text-muted-foreground text-center p-4">You haven't submitted any complaints yet.</p></GlassCard>
          ) : (
            userComplaints.map((complaint, index) => (
              <motion.div key={complaint.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                <GlassCard hover>
                  <Link to={`/portal/complaint/${complaint.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          {getStatusIcon(complaint.status)}
                          <h3 className="text-xl font-semibold">{complaint.title}</h3>
                          <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2 line-clamp-2">{complaint.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <span>ID: {complaint.id}</span>
                          <span>Category: {complaint.category}</span>
                          <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(complaint.status)}`}>
                        {complaint.status}
                      </div>
                    </div>
                  </Link>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default UserPortal;