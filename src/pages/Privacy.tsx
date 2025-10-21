import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: "We collect information you provide directly to us, including name, email address, and complaint details. We also collect usage data to improve our services.",
    },
    {
      title: "How We Use Your Information",
      content: "Your information is used to process complaints, communicate with you, improve our services, and ensure platform security.",
    },
    {
      title: "Data Sharing",
      content: "We do not sell your personal information. We only share data with authorized personnel necessary for complaint resolution.",
    },
    {
      title: "Data Security",
      content: "We implement industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure.",
    },
    {
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.",
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
            <Shield className="text-neon-cyan mx-auto mb-6" size={64} />
            <h1 className="text-5xl font-bold neon-text mb-4">Privacy Policy</h1>
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
                  <h2 className="text-2xl font-semibold mb-4 text-neon-cyan">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@grievancehub.com" className="text-neon-cyan hover:underline">
                privacy@grievancehub.com
              </a>
            </p>
          </GlassCard>
        </motion.div>
      </main>
  );
};

export default Privacy;
