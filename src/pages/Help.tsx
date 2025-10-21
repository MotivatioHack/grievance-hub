import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, HelpCircle, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

const Help = () => {
  const helpTopics = [
    {
      question: "How do I submit a complaint?",
      answer: "You can submit a complaint by logging into your account and clicking the 'Submit Complaint' button. Fill in all required details and attach any supporting documents.",
    },
    {
      question: "How long does it take to resolve a complaint?",
      answer: "Most complaints are resolved within 3-5 business days. High-priority complaints are handled within 24 hours.",
    },
    {
      question: "Can I track my complaint status?",
      answer: "Yes! Once you submit a complaint, you'll receive a unique ID. You can use this to track your complaint's progress in real-time.",
    },
    {
      question: "What happens if my complaint is escalated?",
      answer: "Escalated complaints are automatically forwarded to senior management for priority handling and resolution.",
    },
  ];

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold neon-text mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground mb-8">Find answers to common questions</p>
            
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                className="pl-12 py-6 text-lg input-glow bg-muted/50"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 mb-12">
            {helpTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover>
                  <div className="flex gap-4">
                    <HelpCircle className="text-neon-cyan flex-shrink-0" size={24} />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{topic.question}</h3>
                      <p className="text-muted-foreground">{topic.answer}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Still need help?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 glass-card">
                <Mail className="text-neon-cyan mx-auto mb-4" size={48} />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground">support@grievancehub.com</p>
              </div>
              <div className="text-center p-6 glass-card">
                <Phone className="text-neon-purple mx-auto mb-4" size={48} />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </main>
  );
};

export default Help;
