import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { FileText } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using GrievanceHub, you accept and agree to be bound by these terms and conditions.",
    },
    {
      title: "User Responsibilities",
      content: "Users must provide accurate information, maintain confidentiality of their account, and use the platform responsibly and lawfully.",
    },
    {
      title: "Complaint Submissions",
      content: "All complaints must be submitted in good faith. False or malicious complaints may result in account suspension.",
    },
    {
      title: "Intellectual Property",
      content: "All content and materials on GrievanceHub are protected by copyright and other intellectual property rights.",
    },
    {
      title: "Limitation of Liability",
      content: "GrievanceHub is not liable for any indirect, incidental, or consequential damages arising from use of the platform.",
    },
    {
      title: "Modifications",
      content: "We reserve the right to modify these terms at any time. Continued use after modifications constitutes acceptance.",
    },
  ];

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <FileText className="text-neon-purple mx-auto mb-6" size={64} />
            <h1 className="text-5xl font-bold neon-text mb-4">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">Last updated: January 2025</p>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <h2 className="text-2xl font-semibold mb-4 text-neon-purple">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, contact us at{" "}
              <a href="mailto:legal@grievancehub.com" className="text-neon-cyan hover:underline">
                legal@grievancehub.com
              </a>
            </p>
          </GlassCard>
        </motion.div>
      </main>
  );
};

export default Terms;
