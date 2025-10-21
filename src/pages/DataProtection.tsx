import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Lock } from "lucide-react";

const DataProtection = () => {
  const sections = [
    {
      title: "Data Collection",
      content: "We collect only necessary information to provide our services, including personal details, complaint information, and usage data.",
    },
    {
      title: "Data Storage",
      content: "All data is stored on secure servers with encryption. We implement regular backups and security audits.",
    },
    {
      title: "Data Access",
      content: "Only authorized personnel have access to your data. Access logs are maintained for accountability.",
    },
    {
      title: "Data Retention",
      content: "We retain your data as long as necessary to provide services and comply with legal obligations.",
    },
    {
      title: "Your Rights",
      content: "You have the right to access, rectify, erase, and port your data. You can also object to processing.",
    },
    {
      title: "Security Measures",
      content: "We use SSL encryption, firewalls, intrusion detection, and regular security assessments to protect your data.",
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
            <Lock className="text-neon-pink mx-auto mb-6" size={64} />
            <h1 className="text-5xl font-bold neon-text mb-4">Data Protection</h1>
            <p className="text-xl text-muted-foreground">How we protect your information</p>
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
                  <h2 className="text-2xl font-semibold mb-4 text-neon-pink">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Our DPO</h2>
            <p className="text-muted-foreground">
              For data protection inquiries, contact our Data Protection Officer at{" "}
              <a href="mailto:dpo@grievancehub.com" className="text-neon-cyan hover:underline">
                dpo@grievancehub.com
              </a>
            </p>
          </GlassCard>
        </motion.div>
      </main>
  );
};

export default DataProtection;
