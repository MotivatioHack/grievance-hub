import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const footerLinks = [
    { title: "Help Center", path: "/help" },
    { title: "Privacy Policy", path: "/privacy" },
    { title: "FAQ", path: "/faq" },
    { title: "Terms of Service", path: "/terms" },
    { title: "Data Protection", path: "/data-protection" },
    { title: "Accessibility", path: "/accessibility" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card border-t border-glass-border/50 mt-20"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-neon-cyan" size={32} />
              <span className="text-xl font-bold neon-text">GrievanceHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your voice matters. Report issues, track progress, and get resolutions efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.slice(3).map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-primary">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-neon-cyan" />
                support@grievancehub.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-neon-cyan" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-neon-cyan" />
                123 Portal Street, City
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-glass-border/30 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 GrievanceHub. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};
