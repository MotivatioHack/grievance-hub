import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, FileText, BarChart3, Bell, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

const Home = () => {
  const features = [
    {
      icon: FileText,
      title: "Submit Complaints",
      description: "Easy-to-use form for reporting issues with file attachments",
    },
    {
      icon: Clock,
      title: "Track Status",
      description: "Real-time updates on your complaint resolution progress",
    },
    {
      icon: Bell,
      title: "Get Notifications",
      description: "Instant alerts when your complaint status changes",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights for administrators",
    },
    {
      icon: CheckCircle,
      title: "Quick Resolution",
      description: "Efficient complaint handling and escalation system",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text">
              Welcome to GrievanceHub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your voice matters. Report issues, track progress, and get resolutions efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:neon-glow text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary hover:neon-glow">
                  Sign In
                </Button>
              </Link>
              <Link to="/anonymous">
                <Button size="lg" variant="ghost" className="text-lg px-8 hover:neon-glow">
                  Submit Anonymously
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-12 neon-text"
          >
            Why Choose GrievanceHub?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover>
                  <feature.icon className="text-neon-cyan mb-4" size={48} />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { value: "10K+", label: "Complaints Resolved" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "24h", label: "Average Response Time" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <GlassCard>
                  <div className="text-5xl font-bold text-neon-cyan mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>
    </>
  );
};

export default Home;
