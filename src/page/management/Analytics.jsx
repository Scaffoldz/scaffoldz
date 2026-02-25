import { useState, useEffect } from "react";
import api from "../../services/api";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryStats, setSummaryStats] = useState([]);
  const [projectEfficiency, setProjectEfficiency] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // Fetch all projects to calculate efficiency and total budget (Revenue/Potential)
        const projectsData = await api.projects.getAll();
        const allProjects = projectsData.projects;

        // Fetch overall payments (Expenses from company perspective, or Revenue if it's customer payments)
        // In this context, let's treat completed payments as Revenue and all project budgets as potential.
        // For a more realistic "Analytics", we'd need a specific analytics endpoint, 
        // but we can calculate from projects and payments.

        // Calculate basic stats
        const totalBudget = allProjects.reduce((sum, p) => sum + Number(p.budget || 0), 0);
        const activeProjectsCount = allProjects.filter(p => !['Completed', 'Cancelled'].includes(p.status)).length;

        setSummaryStats([
          { label: "Total Project Value", amount: `₹ ${(totalBudget / 10000000).toFixed(2)} Cr`, trend: "Lifetime", color: "text-primary" },
          { label: "Active Projects", amount: activeProjectsCount.toString(), trend: "Ongoing", color: "text-green-600" },
          { label: "Average Budget", amount: `₹ ${(totalBudget / (allProjects.length || 1) / 100000).toFixed(2)} L`, trend: "Per Project", color: "text-blue-600" },
          { label: "Total Projects", amount: allProjects.length.toString(), trend: "All Time", color: "text-orange-600" },
        ]);

        // Map projects to efficiency display
        const efficiency = allProjects.slice(0, 5).map(p => ({
          name: p.title,
          progress: p.status === 'Completed' ? 100 : (p.status === 'In Progress' ? 65 : 10), // simplified progress
          status: p.status === 'Completed' ? 'Completed' : (['In Progress', 'Assigned'].includes(p.status) ? 'On Track' : 'Pending')
        }));
        setProjectEfficiency(efficiency);

        // Simple monthly chart data based on project creation dates
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();
        const monthlyData = months.map((month, index) => {
          const count = allProjects.filter(p => {
            const date = new Date(p.created_at);
            return date.getMonth() === index && date.getFullYear() === currentYear;
          }).length;
          return { month, revenue: count * 10 || 5, expense: count * 7 || 3 }; // Mocked visualization scaling
        });
        setChartData(monthlyData.slice(0, 6)); // Show first 6 months for layout

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Financial & Operational Analytics</h1>
        <p className="text-gray-500 mt-1">Real-time performance metrics across all construction projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryStats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{s.label}</p>
            <div className="flex justify-between items-end">
              <p className={`text-2xl font-bold ${s.color}`}>{s.amount}</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-500">
                {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue vs Expense Chart */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-800">Growth Projection (Monthly)</h3>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary rounded-sm"></div> Projects</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-accent/40 rounded-sm"></div> Bids</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div className="w-full flex justify-center gap-1 items-end h-48">
                  <div
                    className="w-1/2 bg-primary rounded-t-sm hover:bg-primary/90 transition-all cursor-pointer"
                    style={{ height: `${data.revenue * 5}%` }}
                    title={`${data.revenue} Projects`}
                  ></div>
                  <div
                    className="w-1/2 bg-accent/40 rounded-t-sm"
                    style={{ height: `${data.expense * 5}%` }}
                    title={`${data.expense} Bids`}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Efficiency */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Operational Efficiency by Project</h3>
          <div className="flex-1 space-y-6">
            {projectEfficiency.map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-700">{p.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === "Ahead" || p.status === "Completed" ? "bg-blue-50 text-blue-600" :
                      p.status === "On Track" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>{p.status}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${p.status === "Ahead" || p.status === "Completed" ? "bg-blue-500" :
                        p.status === "On Track" ? "bg-primary" : "bg-red-400"
                      }`}
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-[10px] text-gray-400 font-bold">{p.progress}% Completed</p>
              </div>
            ))}
            {projectEfficiency.length === 0 && (
              <p className="text-center text-gray-500 py-4">No active projects to display efficiency.</p>
            )}
          </div>
          <button className="mt-8 text-sm text-primary font-bold hover:underline flex items-center justify-center gap-2 border border-gray-100 py-2 rounded-lg">
            View Full Operational Report →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
