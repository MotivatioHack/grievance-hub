import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Clock, Tag, Calendar, User, MessageSquare, Send, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/Timeline";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Complaint, Comment as CommentType, TimelineEvent } from "@/data/dummyData";

interface FetchedComplaint extends Complaint {
    TimelineEvents?: TimelineEvent[];
    Comments?: CommentType[];
}

const AdminComplaintView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const parsedUser = userString ? JSON.parse(userString) : null;

  const [complaint, setComplaint] = useState<FetchedComplaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [responseData, setResponseData] = useState({
    status: "Pending" as Complaint['status'],
    assignedTo: "",
    response: "",
  });
  const [isEscalating, setIsEscalating] = useState(false); // State for escalate button loading


  // Fetch Complaint Details (Keep existing useEffect)
  useEffect(() => {
    const fetchComplaintDetails = async () => {
        // ... (keep existing fetch logic) ...
         if (!id || !parsedUser?.token) {
            setError("Invalid request or not logged in.");
            setLoading(false);
            return;
         }

         try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${parsedUser.token}` },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Complaint ${id} not found.`);
            }
            const data: FetchedComplaint = await response.json();
            setComplaint(data);
            setComments(data.Comments || []);
            setResponseData({ status: data.status, assignedTo: data.assignedTo || "", response: "" });
         } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
            setComplaint(null);
         } finally {
            setLoading(false);
         }
    };
    fetchComplaintDetails();
  }, [id, parsedUser?.token]);

  // --- Handlers for Admin Actions ---

  // handleUpdateComplaint (Keep existing function)
  const handleUpdateComplaint = async () => { /* ... existing code ... */
     if (!complaint || !parsedUser?.token) return;
     try {
        const response = await fetch(`http://localhost:5000/api/admin/complaints/${complaint.id}/respond`, {
             method: "PUT",
             headers: { "Content-Type": "application/json", Authorization: `Bearer ${parsedUser.token}` },
             body: JSON.stringify({ status: responseData.status, response: responseData.response }),
        });
        if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message || "Failed to update complaint");
        }
        const updatedComplaintData: FetchedComplaint = await response.json();
        setComplaint(updatedComplaintData);
        setComments(updatedComplaintData.Comments || []);
        setResponseData(prev => ({ ...prev, status: updatedComplaintData.status, response: "" }));
        toast.success("Complaint updated successfully!");
     } catch (error: any) {
         toast.error(error.message || "Could not update complaint.");
     }
  };

  // handleAddComment (Keep existing function)
  const handleAddComment = async (isInternal = false) => { /* ... existing code ... */
      if (!newComment.trim() || !complaint || !parsedUser?.token) return;
      try {
        const response = await fetch(`http://localhost:5000/api/users/complaints/${complaint.id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${parsedUser.token}` },
            body: JSON.stringify({ message: newComment }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add comment");
        }
        const addedComment = await response.json();
        const userRole = parsedUser.role.toLowerCase() === 'admin' ? 'admin' : 'user';
        const newCommentData: CommentType = {
          id: addedComment.id, complaintId: String(complaint.id), author: parsedUser.name,
          role: 'Admin', content: addedComment.message, timestamp: addedComment.createdAt,
          isInternal: isInternal, User: { name: parsedUser.name, role: userRole },
          UserId: parsedUser._id // Adjust if your user object uses 'id' instead of '_id'
        };
        setComments(prev => [...prev, newCommentData]);
        setComplaint(prev => prev ? ({...prev, Comments: [...(prev.Comments || []), newCommentData], TimelineEvents: addedComment.TimelineEvent ? [...(prev.TimelineEvents || []), addedComment.TimelineEvent] : prev.TimelineEvents }) : null);
        setNewComment("");
        toast.success("Comment added successfully!");
      } catch (error: any) {
        toast.error(error.message || "Could not add comment.");
      }
  };

  // --- ADD THIS FUNCTION ---
  const handleEscalate = async () => {
    if (!complaint || !parsedUser?.token || complaint.status === 'Escalated' || complaint.status === 'Resolved') return;

    setIsEscalating(true); // Set loading state for button
    try {
        const response = await fetch(`http://localhost:5000/api/admin/complaints/${complaint.id}/escalate`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${parsedUser.token}`,
                // No body needed unless you send extra data
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to escalate complaint");
        }

        const updatedComplaintData: FetchedComplaint = await response.json();

        // Update local state
        setComplaint(updatedComplaintData);
        setComments(updatedComplaintData.Comments || []); // Update comments if included
        setResponseData(prev => ({ ...prev, status: updatedComplaintData.status })); // Update status in form

        toast.warning("Complaint escalated!");

    } catch (error: any) {
        toast.error(error.message || "Could not escalate complaint.");
    } finally {
        setIsEscalating(false); // Reset loading state
    }
  };
  // --- END NEW FUNCTION ---

  // --- Helper Functions (Keep existing) ---
  const getPriorityColor = (priority?: Complaint['priority']) => { /* ... existing code ... */
    switch (priority) { case "Urgent": return "text-red-500"; case "High": return "text-orange-500"; case "Medium": return "text-yellow-500"; case "Low": return "text-green-500"; default: return "text-muted-foreground"; }
  };
  const getStatusClass = (status?: Complaint['status']) => { /* ... existing code ... */
    switch (status) { case "Resolved": return "bg-green-500/20 text-green-400"; case "Escalated": return "bg-red-500/20 text-red-400"; case "In Progress": return "bg-yellow-500/20 text-yellow-400"; case "Pending": default: return "bg-blue-500/20 text-blue-400"; }
  };
  // --- End Helper Functions ---


  // --- Render Logic (Keep existing) ---
  if (!userString || parsedUser?.role !== "Admin") { return <Navigate to="/login" />; }
  if (loading) { return <div className="container mx-auto px-4 py-12 text-center">Loading complaint details...</div>; }
  if (error) { return <div className="container mx-auto px-4 py-12 text-center text-red-500">{error}</div>; }
  if (!complaint) { return <div className="container mx-auto px-4 py-12 text-center">Complaint not found.</div>; }
  // --- End Render Logic ---

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* ... (Back button, Complaint Info card remain the same) ... */}
           <Link to="/admin">
            <Button variant="ghost" className="mb-6"><ArrowLeft className="mr-2" size={18} />Back to Dashboard</Button>
           </Link>

           <div className="grid lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 space-y-6">
                <GlassCard>
                  <div className="flex items-center justify-between mb-4 flex-wrap">
                    <h1 className="text-3xl font-bold neon-text mr-4">{complaint.title}</h1>
                    <span className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(complaint.status)}`}>{complaint.status}</span>
                  </div>
                  <p className="text-muted-foreground">{complaint.description}</p>
                </GlassCard>

                {/* Admin Response Section */}
                <GlassCard>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Send className="text-neon-cyan" />Admin Response & Actions</h2>
                  <div className="space-y-4">
                     {/* Status Select and Assign To */}
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="statusSelect">Update Status</Label>
                           <select id="statusSelect" className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-glass-border input-glow" value={responseData.status} onChange={(e) => setResponseData({ ...responseData, status: e.target.value as Complaint['status'] })}>
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Escalated">Escalated</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="assignToInput">Assign To (Optional)</Label>
                           <Input id="assignToInput" placeholder="Staff name or ID" className="input-glow bg-muted/50" value={responseData.assignedTo} onChange={(e) => setResponseData({ ...responseData, assignedTo: e.target.value })} />
                        </div>
                     </div>
                     {/* Response Textarea */}
                     <div className="space-y-2">
                           <Label htmlFor="responseTextarea">Response / Internal Note</Label>
                           <Textarea id="responseTextarea" placeholder="Add response for the user or an internal note..." className="input-glow bg-muted/50" value={responseData.response} onChange={(e) => setResponseData({ ...responseData, response: e.target.value })} />
                     </div>
                     {/* Action Buttons */}
                     <div className="flex gap-2 flex-wrap"> {/* Added flex-wrap */}
                        <Button onClick={handleUpdateComplaint} className="bg-primary hover:neon-glow" disabled={(!responseData.response && responseData.status === complaint.status) || isEscalating}>
                            Update & Respond
                        </Button>
                        {/* --- ADDED ESCALATE BUTTON --- */}
                        <Button
                            onClick={handleEscalate}
                            variant="destructive"
                            className="hover:neon-glow"
                            disabled={complaint.status === 'Escalated' || complaint.status === 'Resolved' || isEscalating}
                        >
                           {isEscalating ? 'Escalating...' : 'Escalate'}
                           {!isEscalating && <AlertTriangle className="ml-2 h-4 w-4" />}
                        </Button>
                        {/* --- END ESCALATE BUTTON --- */}
                     </div>
                  </div>
                </GlassCard>

                {/* Timeline */}
                 {complaint.TimelineEvents && complaint.TimelineEvents.length > 0 && (
                   <GlassCard>
                     <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Clock className="text-neon-cyan" />Timeline</h2>
                     <Timeline events={complaint.TimelineEvents} />
                   </GlassCard>
                 )}

                {/* Comments */}
                 <GlassCard>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><MessageSquare className="text-neon-cyan" />Comments ({comments.length})</h2>
                    <div className="space-y-4 mb-6">
                        {comments.map((comment) => ( /* ... comment rendering ... */
                         <div key={comment.id} className="glass-card p-4">
                           <div className="flex items-center gap-2 mb-2 flex-wrap">
                             <span className="font-semibold">{comment.User?.name || comment.author || 'Unknown'}</span>
                             <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">{comment.User?.role ? (comment.User.role === 'admin' ? 'Admin' : 'User') : comment.role}</span>
                             {comment.isInternal && <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400">Internal</span>}
                             <span className="text-sm text-muted-foreground ml-auto">{new Date(comment.timestamp || complaint.createdAt).toLocaleString()}</span>
                           </div>
                           <p className="text-muted-foreground">{comment.content}</p>
                         </div>
                        ))}
                        {comments.length === 0 && <p className="text-muted-foreground text-sm">No comments yet.</p>}
                    </div>
                    {/* Add comment section */}
                    <div className="space-y-2">
                       <Textarea placeholder="Add a comment (visible to user)..." className="input-glow bg-muted/50" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                       <Button onClick={() => handleAddComment(false)} className="bg-primary hover:neon-glow" disabled={!newComment.trim()}>Add Public Comment</Button>
                    </div>
                 </GlassCard>
             </div> {/* End Main Content Column */}

             {/* Sidebar */}
             <div className="space-y-6">
                {/* Complaint Details Card */}
                <GlassCard>
                  <h3 className="font-semibold mb-4">Complaint Details</h3>
                  <div className="space-y-3 text-sm">
                      {/* ... (Details like ID, Category, Priority, Submitted Date/By) ... */}
                        <div className="flex items-center gap-2"><FileText className="text-neon-cyan" size={18} /><span className="text-muted-foreground">ID:</span><span className="font-medium">{complaint.id}</span></div>
                        <div className="flex items-center gap-2"><Tag className="text-neon-cyan" size={18} /><span className="text-muted-foreground">Category:</span><span className="font-medium">{complaint.category}</span></div>
                        <div className="flex items-center gap-2"><Clock className="text-neon-cyan" size={18} /><span className="text-muted-foreground">Priority:</span><span className={`font-medium ${getPriorityColor(complaint.priority)}`}>{complaint.priority}</span></div>
                        <div className="flex items-center gap-2"><Calendar className="text-neon-cyan" size={18} /><span className="text-muted-foreground">Submitted:</span><span className="font-medium">{new Date(complaint.createdAt).toLocaleDateString()}</span></div>
                        <div className="flex items-center gap-2"><User className="text-neon-cyan" size={18} /><span className="text-muted-foreground">Submitted By:</span><span className="font-medium">{complaint.User?.name || 'Anonymous'}</span></div>
                        {complaint.assignedTo && <div className="flex items-center gap-2"><User className="text-neon-cyan" size={18} /><span className="text-muted-foreground">Assigned To:</span><span className="font-medium">{complaint.assignedTo}</span></div>}
                  </div>
                </GlassCard>
                {/* Attachment Card */}
                 {complaint.attachment && (
                   <GlassCard>
                     <h3 className="font-semibold mb-4">Attachment</h3>
                     <a href={`http://localhost:5000/${complaint.attachment.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="block glass-card p-3 hover:neon-glow transition-all cursor-pointer">
                       <div className="flex items-center justify-between">
                         <span className="text-sm truncate">{complaint.attachment.split(/[-/\\]+/).pop()}</span>
                         <FileText className="text-neon-cyan" size={18} />
                       </div>
                     </a>
                   </GlassCard>
                 )}
             </div> {/* End Sidebar Column */}

           </div> {/* End Grid */}
        </motion.div>
      </main>
  );
};

export default AdminComplaintView;