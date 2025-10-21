import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is GrievanceHub?",
      answer: "GrievanceHub is an online complaint and grievance management portal that allows users to submit, track, and resolve complaints efficiently.",
    },
    {
      question: "Do I need an account to submit a complaint?",
      answer: "No, you can submit complaints anonymously. However, having an account allows you to track your complaints and receive updates.",
    },
    {
      question: "How do I track my complaint?",
      answer: "After submitting a complaint, you'll receive a unique ID. Use this ID to track your complaint's status and view updates in real-time.",
    },
    {
      question: "What information do I need to provide?",
      answer: "You'll need to provide a complaint title, category, description, and priority level. You can also attach supporting documents.",
    },
    {
      question: "How long does complaint resolution take?",
      answer: "Resolution time varies by priority level. Urgent complaints are handled within 24 hours, while others typically resolve within 3-5 business days.",
    },
    {
      question: "Can I update my complaint after submission?",
      answer: "You cannot directly edit a submitted complaint, but you can add comments with additional information.",
    },
    {
      question: "What happens if my complaint is escalated?",
      answer: "Escalated complaints are automatically forwarded to senior management for priority handling.",
    },
    {
      question: "How do I contact support?",
      answer: "You can reach us at support@grievancehub.com or call +1 (555) 123-4567.",
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
            <h1 className="text-5xl font-bold neon-text mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">Quick answers to common questions</p>
          </div>

          <GlassCard>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-neon-cyan transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
        </motion.div>
      </main>
  );
};

export default FAQ;
