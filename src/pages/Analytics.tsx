import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Download, BarChart3, PieChart, TrendingUp, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, PieChart as RechartsPie, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Define the structure of the fetched analytics data
interface AnalyticsData {
  complaintsByCategory: { name: string; value: number }[];
  complaintsByStatus: { name: string; value: number }[];
  monthlyTrends: { month: string; complaints: number }[];
  summaryStats: {
    totalComplaints: number;
    avgResolutionTime: string;
    resolutionRate: string;
  };
}

// Define User type based on localStorage structure
interface UserData {
    token: string;
    role: 'User' | 'Admin'; // Match case used in your app
    // Add other properties if needed (name, _id, etc.)
}

const COLORS = ["#00c8ff", "#b366ff", "#ff66cc", "#66ff99", "#ffcc66"];

// Custom component for a glowing spinner
const GlowingSpinner = () => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-t-neon-cyan border-r-neon-purple border-b-neon-pink border-l-transparent rounded-full"
    />
);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  // Effect 1: Parse user data from localStorage on component mount
  useEffect(() => {
    console.log("Analytics Mount: Checking localStorage for user...");
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const parsed: UserData = JSON.parse(userString);
        console.log("Analytics Mount: Parsed user data:", parsed);
        // Basic validation of parsed data
        if (parsed && parsed.token && parsed.role === 'Admin') {
           setCurrentUser(parsed);
        } else {
            console.error("Analytics Mount: Invalid user data or not Admin:", parsed);
            setError("Stored user data is invalid or user is not an Admin. Please log in again.");
            setLoading(false); // Stop loading as we can't proceed
        }
      } catch (e) {
        console.error("Analytics Mount: Failed to parse user data:", e);
        setError("Invalid user data stored. Please log out and log in again.");
        setLoading(false); // Stop loading
      }
    } else {
      console.warn("Analytics Mount: No user data found in localStorage.");
      setError("No user logged in. Please log in as an Admin.");
      setLoading(false); // Stop loading
    }
  }, []); // Empty dependency array means run only once on mount

  // Effect 2: Fetch analytics data *after* currentUser state is successfully set
  useEffect(() => {
    // Only run if currentUser has been set and we are not in an error state from the first effect
    if (!currentUser || error) {
        // If loading is still true, it means the initial user check failed.
        if (loading) setLoading(false);
        return;
    }

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null); // Clear previous errors before fetching
      console.log(`Analytics Fetch: Attempting fetch with token starting with: ${currentUser.token.substring(0, 10)}...`);
      try {
        const response = await fetch("http://localhost:5000/api/admin/analytics", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Use token from state
          },
        });
        console.log("Analytics Fetch: Response status:", response.status);

        if (!response.ok) {
          let errorMsg = `HTTP Error: ${response.status}`;
          try {
            const errorData = await response.json();
             errorMsg = errorData.message || errorMsg;
             console.error("Analytics Fetch: API Error response:", errorData);
             // Specifically handle 401/403 errors more gracefully
             if (response.status === 401 || response.status === 403) {
                 errorMsg = "Authorization failed. Your session might have expired. Please log in again.";
                 localStorage.removeItem('user'); // Clear invalid token
                 setCurrentUser(null); // Clear user state to trigger re-render/redirect
             }
          } catch (e) { console.warn("Analytics Fetch: Could not parse error response body.");}
          throw new Error(errorMsg);
        }

        const data: AnalyticsData = await response.json();
        console.log("Analytics Fetch: Successfully fetched data:", data);

        // Check if data is meaningfully empty
        if (!data || !data.complaintsByCategory || data.complaintsByCategory.length === 0) {
            console.warn("Analytics Fetch: Data received but seems empty.");
            setError("No analytics data found. Ensure complaints exist in the database.");
            setAnalyticsData(null);
        } else {
            setAnalyticsData(data);
            console.log("Analytics Fetch: Data state updated.");
        }
      } catch (err: any) {
        console.error("Analytics Fetch: Error during fetch process:", err);
        setError(err.message || "An unknown error occurred while fetching data.");
        toast.error(err.message || "An unknown error occurred.");
        setAnalyticsData(null);
      } finally {
        console.log("Analytics Fetch: Finished, setting loading false.");
        setLoading(false);
      }
    };

    fetchAnalytics();

  }, [currentUser]); // Re-run fetch ONLY when currentUser state changes

  // Redirect Logic - redirect if not loading and no valid currentUser exists
  if (!loading && !currentUser && !error) {
     console.log("Analytics Render: Redirecting to login. No valid user.");
     return <Navigate to="/login" replace />; // Use replace to avoid back button issues
  }


  // --- UI Functions ---
  const handleExport = (type: 'CSV' | 'PDF') => { toast.success(`Exporting analytics as ${type}... (demo)`); };
  const renderEmptyOrErrorState = (message: string) => (
      <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Could Not Load Analytics</h3>
          <p className="text-muted-foreground">{message}</p>
          {(message.includes("Invalid user data") || message.includes("Authorization failed")) && (
            <Button onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} className="mt-4">Go to Login</Button>
          )}
      </motion.div>
  );
  // --- End UI Functions ---

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-8 flex-wrap">
            <div>
              <Link to="/admin"><Button variant="ghost" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back to Dashboard</Button></Link>
              <h1 className="text-4xl font-bold neon-text mb-2">Analytics & Reports</h1>
              <p className="text-muted-foreground">Live insights into complaint management</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button onClick={() => handleExport('CSV')} variant="outline" className="border-neon-cyan hover:neon-glow"><Download className="mr-2" size={18} /> Export CSV</Button>
              <Button onClick={() => handleExport('PDF')} variant="outline" className="border-neon-purple hover:neon-glow"><Download className="mr-2" size={18} /> Export PDF</Button>
            </div>
          </div>

          {/* Main Content Area: Loading, Error, or Data */}
          {loading ? (
             <div className="flex justify-center items-center py-20"><GlowingSpinner /></div>
          ) : error ? ( // Display error message if it exists
             <GlassCard>{renderEmptyOrErrorState(error)}</GlassCard>
          ) : !analyticsData ? ( // Display empty state if no error but data is null/empty
             <GlassCard>{renderEmptyOrErrorState("No data was returned or data is empty. Ensure complaints exist.")}</GlassCard>
          ) : (
            // Render charts only if loading is false, no error, and analyticsData exists
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Complaints by Category */}
                <GlassCard>
                  <div className="flex items-center gap-2 mb-6"><PieChart className="text-neon-cyan" size={24} /><h2 className="text-2xl font-semibold">Complaints by Category</h2></div>
                    {analyticsData.complaintsByCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <RechartsPie>
                            <Pie data={analyticsData.complaintsByCategory} cx="50%" cy="50%" labelLine={false} label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                              {analyticsData.complaintsByCategory.map((_, index) => (<Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "rgba(30, 20, 50, 0.9)", border: "1px solid rgba(0, 200, 255, 0.3)", borderRadius: "8px" }} />
                            <Legend />
                          </RechartsPie>
                        </ResponsiveContainer>
                    ) : (<p className="text-muted-foreground text-center py-10">No category data available.</p>)}
                </GlassCard>

                {/* Complaints by Status */}
                <GlassCard>
                  <div className="flex items-center gap-2 mb-6"><BarChart3 className="text-neon-purple" size={24} /><h2 className="text-2xl font-semibold">Complaints by Status</h2></div>
                     {analyticsData.complaintsByStatus.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={analyticsData.complaintsByStatus}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(30, 20, 50, 0.9)", border: "1px solid rgba(0, 200, 255, 0.3)", borderRadius: "8px" }} />
                            <Bar dataKey="value">
                               {analyticsData.complaintsByStatus.map((_, index) => (<Cell key={`cell-stat-${index}`} fill={COLORS[index % COLORS.length]} />))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                     ): (<p className="text-muted-foreground text-center py-10">No status data available.</p>)}
                </GlassCard>

                {/* Monthly Trends */}
                <GlassCard className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-6"><TrendingUp className="text-neon-pink" size={24} /><h2 className="text-2xl font-semibold">Monthly Complaint Trends</h2></div>
                    {analyticsData.monthlyTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={analyticsData.monthlyTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="#fff" />
                            <YAxis stroke="#fff" allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(30, 20, 50, 0.9)", border: "1px solid rgba(0, 200, 255, 0.3)", borderRadius: "8px" }} />
                            <Legend />
                            <Line type="monotone" dataKey="complaints" stroke="#00c8ff" strokeWidth={3} dot={{ fill: "#00c8ff", r: 6 }} activeDot={{ r: 8 }}/>
                          </LineChart>
                        </ResponsiveContainer>
                    ) : (<p className="text-muted-foreground text-center py-10">No trend data available for the last 6 months.</p>)}
                </GlassCard>

                {/* Summary Stats */}
                <GlassCard className="lg:col-span-2">
                  <h2 className="text-2xl font-semibold mb-6">Summary Statistics</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-neon-cyan mb-2">{analyticsData.summaryStats.totalComplaints ?? 'N/A'}</p>
                          <p className="text-muted-foreground">Total Complaints</p>
                        </div>
                        <div className="text-center">
                          <p className="text-4xl font-bold text-neon-purple mb-2">{analyticsData.summaryStats.avgResolutionTime ?? 'N/A'}</p>
                          <p className="text-muted-foreground">Avg. Resolution Time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-4xl font-bold text-green-500 mb-2">{analyticsData.summaryStats.resolutionRate ?? 'N/A'}</p>
                          <p className="text-muted-foreground">Resolution Rate</p>
                        </div>
                  </div>
                </GlassCard>
            </div>
          )}
        </motion.div>
      </main>
  );
};

export default Analytics;

