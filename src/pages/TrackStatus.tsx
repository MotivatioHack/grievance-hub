import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Complaint } from "@/data/dummyData"; // Import the main Complaint type
import { toast } from "sonner";

// Updated status steps to match the backend ENUM values
const statusSteps = [
  { key: "Pending", label: "Submitted" },
  { key: "In Progress", label: "In Progress" },
  { key: "Escalated", label: "Escalated" },
  { key: "Resolved", label: "Resolved" },
];

const TrackStatus = () => {
  const [complaintId, setComplaintId] = useState("");
  const [searchResult, setSearchResult] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!complaintId.trim()) return;

    setLoading(true);
    setNotFound(false);
    setSearchResult(null);

    try {
        const response = await fetch(`http://localhost:5000/api/complaints/${complaintId.trim()}`);

        if (response.status === 404) {
            setNotFound(true);
            throw new Error("Complaint not found");
        }
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch complaint status");
        }

        const data: Complaint = await response.json();
        setSearchResult(data);

    } catch (error: any) {
        if (error.message !== "Complaint not found") {
           toast.error(error.message);
        }
    } finally {
        setLoading(false);
    }
  };

  const handleReset = () => {
    setComplaintId("");
    setSearchResult(null);
    setNotFound(false);
  };

  const getStatusIcon = (status: Complaint['status']) => {
    switch (status) {
      case "Pending":
        return <FileText className="w-5 h-5" />;
      case "In Progress":
        return <Clock className="w-5 h-5" />;
      case "Escalated":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case "Resolved":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusIndex = (status: Complaint['status']) => {
    // Find the index, if not found (e.g., for 'Escalated'), handle gracefully
    const index = statusSteps.findIndex((step) => step.key === status);
    // If escalated, show it at the "In Progress" step visually for the timeline bar
    if (status === 'Escalated') return 1;
    return index === -1 ? 0 : index;
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-4"
          >
            <Search className="w-16 h-16 text-neon-cyan neon-glow" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            Track Your Complaint
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your complaint ID to check the current status
          </p>
        </div>

        {/* Search Form */}
        <GlassCard className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-cyan w-5 h-5" />
              <Input
                placeholder="Enter Complaint ID (e.g., 1, 2, 3...)"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 h-12 bg-glass-bg/60 border-glass-border/50 text-foreground placeholder:text-muted-foreground input-glow"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || !complaintId.trim()}
              className="h-12 px-8 bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 transition-all duration-300"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="w-5 h-5" />
                </motion.div>
              ) : (
                "Check Status"
              )}
            </Button>
          </div>
        </GlassCard>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GlassCard className="text-center py-12">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5]}} transition={{ duration: 1.5, repeat: Infinity }} className="inline-block" >
                  <Search className="w-12 h-12 text-neon-cyan neon-glow" />
                </motion.div>
                <p className="mt-4 text-muted-foreground">Searching complaint records...</p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Not Found State */}
        <AnimatePresence>
          {notFound && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <GlassCard className="text-center py-12">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }} className="text-6xl mb-4">😞</motion.div>
                <h3 className="text-2xl font-bold text-destructive mb-2">Complaint Not Found</h3>
                <p className="text-muted-foreground mb-6">No complaint found with ID: <span className="text-foreground font-mono">{complaintId}</span></p>
                <Button onClick={handleReset} variant="outline">Try Again</Button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {searchResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {/* Complaint Details */}
              <GlassCard className="neon-glow">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Complaint ID</p>
                    <p className="text-xl font-bold text-neon-cyan">{String(searchResult.id)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Title</p>
                    <p className="text-xl font-semibold">{searchResult.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="text-lg">{searchResult.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
                    <p className="text-lg">{new Date(searchResult.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Priority</p>
                    <p className="text-lg capitalize">{searchResult.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Assigned Officer</p>
                    <p className="text-lg">{searchResult.assignedTo || "Not assigned yet"}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Status Timeline */}
              <GlassCard>
                <h3 className="text-2xl font-bold mb-6 text-center">Status Timeline</h3>
                <div className="relative pt-4"> {/* Added padding top */}
                  <div className="absolute top-6 left-0 w-full h-1 bg-glass-border/30" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(getStatusIndex(searchResult.status) / (statusSteps.length - 1)) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="absolute top-6 left-0 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple neon-glow"
                  />
                  <div className="relative grid grid-cols-4 gap-4">
                    {statusSteps.map((step, index) => {
                      const currentStatusIndex = getStatusIndex(searchResult.status);
                      const isActive = index <= currentStatusIndex;
                      const isCurrent = (searchResult.status === "Escalated" && step.key === "In Progress") || step.key === searchResult.status;

                      return (
                        <motion.div key={step.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex flex-col items-center text-center">
                          <motion.div
                            animate={isCurrent ? { scale: [1, 1.2, 1], boxShadow: ["0 0 20px rgba(0, 229, 255, 0.5)", "0 0 40px rgba(0, 229, 255, 0.8)", "0 0 20px rgba(0, 229, 255, 0.5)"] } : {}}
                            transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isActive ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-white" : "bg-glass-bg border border-glass-border text-muted-foreground"}`}
                          >
                            {getStatusIcon(step.key as Complaint['status'])}
                          </motion.div>
                          <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-lg mb-4">
                    Current Status:{" "}
                    <span className="font-bold text-neon-cyan capitalize">
                      {searchResult.status}
                    </span>
                  </p>
                  <Button onClick={handleReset} variant="outline">
                    Track Another Complaint
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
};

export default TrackStatus;