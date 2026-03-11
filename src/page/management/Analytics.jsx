import { useState, useEffect } from "react";
import api from "../../services/api";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [bids, setBids] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const projectsData = await api.projects.getAll();
        const allProjects = projectsData.projects || [];
        setProjects(allProjects);

        // Fetch bids for each project to get bid counts
        const bidCounts = {};
        await Promise.all(
          allProjects.map(async (p) => {
            try {
              const b = await api.bids.getByProject(p.id);
              bidCounts[p.id] = (b.bids || []).length;
            } catch {
              bidCounts[p.id] = 0;
            }
          })
        );
        setBids(bidCounts);

        // Build monthly chart data from real project creation dates
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();
        const monthly = months.map((month, index) => {
          const monthProjects = allProjects.filter((p) => {
            const d = new Date(p.created_at);
            return d.getMonth() === index && d.getFullYear() === currentYear;
          });
          const projectCount = monthProjects.length;
          const budgetTotal = monthProjects.reduce((sum, p) => sum + Number(p.budget || 0), 0);
          return { month, projectCount, budgetTotal };
        });
        setChartData(monthly);
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

  // Derived stats from real data
  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget || 0), 0);
  const completedProjects = projects.filter((p) => p.status === "Completed");
  const activeProjects = projects.filter((p) => ["In Progress", "Assigned"].includes(p.status));
  const pendingProjects = projects.filter((p) => ["Submitted", "Under Review", "Bidding"].includes(p.status));
  const totalBids = Object.values(bids).reduce((a, b) => a + b, 0);

  const statusColors = {
    Completed: "bg-blue-50 text-blue-600",
    "In Progress": "bg-green-50 text-green-600",
    Assigned: "bg-green-50 text-green-600",
    Bidding: "bg-yellow-50 text-yellow-600",
    "Under Review": "bg-orange-50 text-orange-600",
    Submitted: "bg-gray-50 text-gray-500",
    "On Hold": "bg-red-50 text-red-500",
    Cancelled: "bg-red-50 text-red-600",
  };

  const statusProgress = {
    Completed: 100,
    "In Progress": 65,
    Assigned: 30,
    Bidding: 15,
    "Under Review": 10,
    Submitted: 5,
    "On Hold": 40,
    Cancelled: 0,
  };

  // For bar chart — scale budget to max 100% height
  const maxBudget = Math.max(...chartData.map((d) => d.budgetTotal), 1);
  const maxCount = Math.max(...chartData.map((d) => d.projectCount), 1);

  const summaryCards = [
    {
      label: "Total Portfolio Value",
      value: totalBudget >= 10000000
        ? `₹ ${(totalBudget / 10000000).toFixed(2)} Cr`
        : `₹ ${(totalBudget / 100000).toFixed(2)} L`,
      badge: "All Projects",
      color: "text-primary",
      icon: "💰",
    },
    {
      label: "Active Projects",
      value: activeProjects.length,
      badge: "In Progress / Assigned",
      color: "text-green-600",
      icon: "🏗️",
    },
    {
      label: "Completed Projects",
      value: completedProjects.length,
      badge: `of ${projects.length} total`,
      color: "text-blue-600",
      icon: "✅",
    },
    {
      label: "Total Bids Received",
      value: totalBids,
      badge: `Across ${pendingProjects.length} open tenders`,
      color: "text-orange-600",
      icon: "📋",
    },
  ];

  // Status breakdown for donut-style list
  const statusBreakdown = Object.entries(
    projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Live performance metrics across {projects.length} project{projects.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryCards.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-400">{s.badge}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Projects Created Bar Chart */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-gray-800">Projects Created This Year</h3>
              <p className="text-xs text-gray-400 mt-0.5">Monthly breakdown for {new Date().getFullYear()}</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary rounded-sm"></div> Count</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-200 rounded-sm"></div> Budget</span>
            </div>
          </div>
          <div className="h-56 flex items-end justify-between gap-2 px-2">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex justify-center gap-1 items-end h-44">
                  {/* Project count bar */}
                  <div
                    className="w-1/2 bg-primary rounded-t hover:bg-primary/80 transition-all cursor-pointer relative"
                    style={{ height: data.projectCount ? `${(data.projectCount / maxCount) * 100}%` : "2px" }}
                    title={`${data.projectCount} project${data.projectCount !== 1 ? "s" : ""}`}
                  >
                    {data.projectCount > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.projectCount}
                      </span>
                    )}
                  </div>
                  {/* Budget bar */}
                  <div
                    className="w-1/2 bg-blue-200 rounded-t hover:bg-blue-300 transition-all cursor-pointer"
                    style={{ height: data.budgetTotal ? `${(data.budgetTotal / maxBudget) * 100}%` : "2px" }}
                    title={data.budgetTotal ? `₹ ${(data.budgetTotal / 100000).toFixed(1)}L budget` : "No budget"}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{data.month}</span>
              </div>
            ))}
          </div>
          {projects.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-4">No project data for this year yet.</p>
          )}
        </div>

        {/* Project Status Breakdown */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-2">Status Breakdown</h3>
          <p className="text-xs text-gray-400 mb-6">{projects.length} total project{projects.length !== 1 ? "s" : ""} across all statuses</p>
          <div className="flex-1 space-y-4">
            {statusBreakdown.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No projects found.</p>
            ) : (
              statusBreakdown.map(([status, count]) => (
                <div key={status} className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[status] || "bg-gray-50 text-gray-500"}`}>
                        {status}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-500">
                      {count} project{count !== 1 ? "s" : ""} ({Math.round((count / projects.length) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${(count / projects.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Per-Project Progress Table */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6">Project Progress Overview</h3>
        {projects.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No projects yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => {
              const progress = statusProgress[p.status] ?? 0;
              const bidCount = bids[p.id] ?? 0;
              return (
                <div key={p.id} className="space-y-2 pb-4 border-b border-gray-50 last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-700 text-sm">{p.title}</span>
                      <span className="ml-2 text-[10px] text-gray-400">📍 {p.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {bidCount > 0 && (
                        <span className="text-[10px] text-gray-400 font-bold">{bidCount} bid{bidCount !== 1 ? "s" : ""}</span>
                      )}
                      {p.budget && (
                        <span className="text-[10px] text-gray-500 font-bold">
                          ₹ {Number(p.budget) >= 10000000
                            ? `${(Number(p.budget) / 10000000).toFixed(2)} Cr`
                            : `${(Number(p.budget) / 100000).toFixed(2)} L`}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[p.status] || "bg-gray-50 text-gray-500"}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${p.status === "Completed" ? "bg-blue-500" :
                          ["In Progress", "Assigned"].includes(p.status) ? "bg-green-500" :
                            p.status === "Cancelled" ? "bg-red-400" : "bg-primary"
                        }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-right text-[10px] text-gray-400">{progress}% estimated progress</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
