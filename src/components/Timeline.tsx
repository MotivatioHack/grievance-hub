import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { TimelineEvent } from "@/data/dummyData";

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline = ({ events }: TimelineProps) => {
  const getIcon = (action: string) => {
    if (action.includes("Resolved")) return <CheckCircle className="text-green-500" />;
    if (action.includes("Escalated")) return <AlertTriangle className="text-neon-pink" />;
    if (action.includes("Review")) return <Clock className="text-neon-purple" />;
    return <Clock className="text-neon-cyan" />;
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-glass-bg border border-glass-border">
              {getIcon(event.action)}
            </div>
            {index < events.length - 1 && (
              <div className="w-0.5 h-full bg-gradient-to-b from-neon-cyan to-neon-purple my-2" />
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="glass-card p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-foreground">{event.action}</h4>
                <span className="text-sm text-muted-foreground">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">By: {event.user}</p>
              {event.details && (
                <p className="text-sm text-muted-foreground mt-2">{event.details}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
