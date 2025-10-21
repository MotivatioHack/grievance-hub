import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = ({ children, className, hover = false }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02, boxShadow: "0 0 30px rgba(0, 200, 255, 0.3)" } : {}}
      className={cn(
        "glass-card p-6 transition-all duration-300",
        hover && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
