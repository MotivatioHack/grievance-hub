import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eye } from "lucide-react";

const Accessibility = () => {
  const features = [
    {
      title: "Keyboard Navigation",
      description: "Full keyboard support for all interactive elements. Use Tab to navigate, Enter to select, and Escape to close dialogs.",
    },
    {
      title: "Screen Reader Support",
      description: "ARIA labels and semantic HTML ensure compatibility with popular screen readers like JAWS, NVDA, and VoiceOver.",
    },
    {
      title: "Color Contrast",
      description: "All text meets WCAG 2.1 AA standards for color contrast ratios to ensure readability.",
    },
    {
      title: "Responsive Design",
      description: "Fully responsive layout works seamlessly on desktop, tablet, and mobile devices.",
    },
    {
      title: "Clear Focus Indicators",
      description: "Visible focus indicators help keyboard users know which element is currently selected.",
    },
    {
      title: "Alternative Text",
      description: "All images and icons include descriptive alternative text for screen reader users.",
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
            <Eye className="text-neon-cyan mx-auto mb-6" size={64} />
            <h1 className="text-5xl font-bold neon-text mb-4">Accessibility Statement</h1>
            <p className="text-xl text-muted-foreground">
              We are committed to ensuring digital accessibility for people with disabilities
            </p>
          </div>

          <GlassCard className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              GrievanceHub is committed to making our platform accessible to all users, regardless of ability.
              We continually work to improve the accessibility of our platform and adhere to Web Content
              Accessibility Guidelines (WCAG) 2.1 Level AA standards.
            </p>
          </GlassCard>

          <div className="space-y-6 mb-8">
            <h2 className="text-3xl font-bold neon-text text-center">Accessibility Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard hover>
                    <h3 className="text-xl font-semibold mb-2 text-neon-cyan">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          <GlassCard>
            <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
            <p className="text-muted-foreground leading-relaxed">
              We welcome feedback on the accessibility of GrievanceHub. If you encounter any accessibility
              barriers, please contact us at{" "}
              <a href="mailto:accessibility@grievancehub.com" className="text-neon-cyan hover:underline">
                accessibility@grievancehub.com
              </a>
            </p>
          </GlassCard>
        </motion.div>
      </main>
  );
};

export default Accessibility;
