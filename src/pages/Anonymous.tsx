import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { FileText, Upload, Send, Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Anonymous = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "Technical",
    description: "",
    priority: "Medium",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [complaintId, setComplaintId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const complaintData = new FormData();
    complaintData.append("title", formData.title);
    complaintData.append("category", formData.category);
    complaintData.append("description", formData.description);
    if (files.length > 0) {
      complaintData.append("attachment", files[0]);
    }

    try {
      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        body: complaintData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit complaint");
      }

      setComplaintId(data.id);
      toast.success(`Complaint submitted! Your ID: ${data.id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="text-neon-cyan" size={48} />
          </Link>
          <h1 className="text-4xl font-bold neon-text mb-2">Anonymous Complaint</h1>
          <p className="text-muted-foreground">Submit without creating an account. Save your Complaint ID for tracking.</p>
        </div>

        <GlassCard>
          {!complaintId ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Complaint Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  className="input-glow bg-muted/50"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-glass-border input-glow"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="Service">Service</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-glass-border input-glow"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your complaint..."
                  className="input-glow bg-muted/50 min-h-[200px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-glass-border rounded-lg p-8 text-center hover:border-neon-cyan transition-colors">
                  <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <Input
                    id="files"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="files"
                    className="cursor-pointer text-neon-cyan hover:underline"
                  >
                    Click to upload files
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    PNG, JPG, PDF up to 10MB
                  </p>
                  {files.length > 0 && (
                    <div className="mt-4 text-sm text-left">
                      <p className="font-semibold mb-2">Selected files:</p>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li key={index} className="text-muted-foreground">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:neon-glow"
              >
                <Send className="mr-2" size={18} />
                Submit Anonymous Complaint
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <FileText className="text-green-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-4 neon-text">Complaint Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your complaint has been submitted successfully. Save this ID for tracking:
              </p>
              <div className="glass-card p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Complaint ID</p>
                <p className="text-3xl font-bold text-neon-cyan">{complaintId}</p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setComplaintId("");
                    setFormData({
                      title: "",
                      category: "Technical",
                      description: "",
                      priority: "Medium",
                    });
                    setFiles([]);
                  }}
                  variant="outline"
                  className="flex-1 border-primary"
                >
                  Submit Another
                </Button>
                <Link to="/" className="flex-1">
                  <Button className="w-full bg-primary hover:neon-glow">
                    Go to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </GlassCard>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            Have an account?{" "}
            <Link to="/login" className="text-neon-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Anonymous;