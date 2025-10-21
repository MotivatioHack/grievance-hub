import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, FileText, Clock, Tag, Calendar, User, MessageSquare } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/Timeline";
// Remove dummy data import if it's no longer needed elsewhere after updates
// import { dummyComplaints } from "@/data/dummyData";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Complaint, Comment as CommentType } from "@/data/dummyData"; // Import types

const ComplaintDetails = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const [complaint, setComplaint] = useState<Complaint | null>(null); // State for fetched complaint
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]); // State for comments

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      if (!id || !user?.token) {
        setError("Invalid request or not logged in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`, // Add token if needed by backend for this route
          },
        });

        if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.message || `Complaint with ID ${id} not found or failed to fetch.`);
        }

        const data: Complaint = await response.json();
        setComplaint(data);
        setComments(data.comments || []); // Initialize comments state
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id, user?.token]); // Re-fetch if ID or token changes

  // Redirect if not logged in
  if (!user) return <Navigate to="/login" />;

  // --- Comment Handling ---
// --- Comment Handling ---
  const handleAddComment = async () => {
    if (!newComment.trim() || !complaint || !user?.token) return;

    try {
        const response = await fetch(`http://localhost:5000/api/users/complaints/${complaint.id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ message: newComment }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add comment");
        }

        const addedComment = await response.json();

        // --- CORRECTION STARTS HERE ---
        // Ensure roles are lowercase to match the 'ComplaintUser' type
        const userRole = user.role.toLowerCase() === 'admin' ? 'admin' : 'user';

        const newCommentData: CommentType = {
          id: addedComment.id,
          complaintId: String(complaint.id),
          author: user.name,
          role: user.role === 'Admin' ? 'Admin' : 'User', // Keep this consistent with CommentType if needed, or adjust CommentType
          content: addedComment.message,
          timestamp: addedComment.createdAt,
          User: {
              name: user.name,
              role: userRole // Use lowercase role here
            },
          UserId: user._id // Assuming user object from localStorage has _id
          // isInternal: false, // Add if your CommentType requires it
        };
        // --- CORRECTION ENDS HERE ---


        setComments(prevComments => [...prevComments, newCommentData]);
        setNewComment("");
        toast.success("Comment added successfully!");

    } catch (error: any) {
        toast.error(error.message || "Could not add comment.");
    }
  };
  // --- End Comment Handling ---
  // --- End Comment Handling ---


  // --- Helper Functions ---
  const getPriorityColor = (priority?: Complaint['priority']) => {
    switch (priority) {
      case "Urgent": return "text-red-500";
      case "High": return "text-orange-500";
      case "Medium": return "text-yellow-500";
      case "Low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusClass = (status?: Complaint['status']) => {
    switch (status) {
      case "Resolved": return "bg-green-500/20 text-green-400";
      case "Escalated": return "bg-red-500/20 text-red-400";
      case "In Progress": return "bg-yellow-500/20 text-yellow-400";
      case "Pending":
      default: return "bg-blue-500/20 text-blue-400";
    }
  };
  // --- End Helper Functions ---


  // --- Render Logic ---
  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading complaint details...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error}</div>;
  }

  if (!complaint) {
     // This case should ideally be covered by the error state now
    return <div className="container mx-auto px-4 py-12 text-center">Complaint not found.</div>;
  }
  // --- End Render Logic ---

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/portal">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2" size={18} />
            Back to Portal
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-4 flex-wrap"> {/* Added flex-wrap */}
                <h1 className="text-3xl font-bold neon-text mr-4">{complaint.title}</h1>
                <span className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <p className="text-muted-foreground">{complaint.description}</p>
            </GlassCard>

            {/* Timeline - Assuming Timeline component works with the fetched structure */}
            {complaint.timeline && complaint.timeline.length > 0 && (
                 <GlassCard>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="text-neon-cyan" />
                    Timeline
                    </h2>
                    <Timeline events={complaint.timeline} />
                 </GlassCard>
            )}

            {/* Comments */}
            <GlassCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="text-neon-cyan" />
                Comments ({comments.length}) {/* Use state variable */}
              </h2>
              <div className="space-y-4 mb-6">
                {comments.map((comment) => ( // Use state variable
                  <div key={comment.id} className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap"> {/* Added flex-wrap */}
                      <span className="font-semibold">{comment.User?.name || comment.author || 'Unknown'}</span>
                      <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                        {comment.User?.role || comment.role} {/* Prefer User.role */}
                      </span>
                      {comment.isInternal && (
                        <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">
                          Internal
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground ml-auto">
                         {/* Use comment.timestamp or createdAt */}
                        {new Date(comment.timestamp || complaint.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-muted-foreground text-sm">No comments yet.</p>}
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  className="input-glow bg-muted/50"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  onClick={handleAddComment}
                  className="bg-primary hover:neon-glow"
                  disabled={!newComment.trim()} // Disable if no text
                >
                  Add Comment
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GlassCard>
              <h3 className="font-semibold mb-4">Complaint Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="text-neon-cyan" size={18} />
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-medium">{complaint.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="text-neon-cyan" size={18} />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{complaint.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-neon-cyan" size={18} />
                  <span className="text-muted-foreground">Priority:</span>
                  <span className={`font-medium ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-neon-cyan" size={18} />
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="font-medium">
                     {/* Use complaint.createdAt */}
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="text-neon-cyan" size={18} />
                  <span className="text-muted-foreground">Submitted By:</span>
                   {/* Use complaint.User?.name */}
                  <span className="font-medium">{complaint.User?.name || 'Anonymous'}</span>
                </div>
                {complaint.assignedTo && (
                  <div className="flex items-center gap-2">
                    <User className="text-neon-cyan" size={18} />
                    <span className="text-muted-foreground">Assigned To:</span>
                    <span className="font-medium">{complaint.assignedTo}</span>
                  </div>
                )}
              </div>
            </GlassCard>

             {/* Use complaint.attachment */}
            {complaint.attachment && (
              <GlassCard>
                <h3 className="font-semibold mb-4">Attachment</h3>
                <div className="space-y-2">
                    {/* Make this a link if your backend serves files */}
                   <a
                    href={`http://localhost:5000/${complaint.attachment.replace(/\\/g, '/')}`} // Basic link, adjust as needed
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block glass-card p-3 hover:neon-glow transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                        {/* Extract filename */}
                       <span className="text-sm truncate">{complaint.attachment.split(/[-/\\]+/).pop()}</span>
                       <FileText className="text-neon-cyan" size={18} />
                    </div>
                  </a>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default ComplaintDetails;