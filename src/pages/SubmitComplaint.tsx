import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import { FileText, Upload, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/login" />;

  const [formData, setFormData] = useState({
    title: "",
    category: "Technical",
    description: "",
    priority: "Medium",
  });
  const [files, setFiles] = useState<File[]>([]);

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
      const token = JSON.parse(user).token;
      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: complaintData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit complaint");
      }

      toast.success("Complaint submitted successfully!");
      setTimeout(() => navigate("/portal"), 1500);
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
    <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold neon-text mb-2">Submit Complaint</h1>
            <p className="text-muted-foreground">Provide details about your issue</p>
          </div>

          <GlassCard>
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

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:neon-glow"
                >
                  <Send className="mr-2" size={18} />
                  Submit Complaint
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/portal")}
                  className="border-primary"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </main>
  );
};

export default SubmitComplaint;