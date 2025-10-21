import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Anonymous from "./pages/Anonymous";
import UserPortal from "./pages/UserPortal";
import SubmitComplaint from "./pages/SubmitComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaintView from "./pages/AdminComplaintView";
import Analytics from "./pages/Analytics";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import DataProtection from "./pages/DataProtection";
import Accessibility from "./pages/Accessibility";
import NotFound from "./pages/NotFound";
import TrackStatus from "./pages/TrackStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout showHeaderFooter={false}><Login /></Layout>} />
          <Route path="/signup" element={<Layout showHeaderFooter={false}><Signup /></Layout>} />
          <Route path="/anonymous" element={<Layout showHeaderFooter={false}><Anonymous /></Layout>} />
          <Route path="/portal" element={<Layout><UserPortal /></Layout>} />
          <Route path="/portal/submit" element={<Layout><SubmitComplaint /></Layout>} />
          <Route path="/portal/complaint/:id" element={<Layout><ComplaintDetails /></Layout>} />
          <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/admin/complaint/:id" element={<Layout><AdminComplaintView /></Layout>} />
          <Route path="/admin/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/help" element={<Layout><Help /></Layout>} />
          <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/terms" element={<Layout><Terms /></Layout>} />
          <Route path="/data-protection" element={<Layout><DataProtection /></Layout>} />
          <Route path="/accessibility" element={<Layout><Accessibility /></Layout>} />
          <Route path="/track-status" element={<Layout><TrackStatus /></Layout>} />
          <Route path="*" element={<Layout showHeaderFooter={false}><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
