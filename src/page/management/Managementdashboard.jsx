import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ManagementDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.projects.getAll();
        setProjects(response.projects || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const projectRequests = projects.filter(p => p.status === 'Submitted' || p.status === 'Under Review');
  const activeProjects = projects.filter(p => !['Submitted', 'Under Review', 'Cancelled', 'Completed'].includes(p.status));
  const completedProjects = projects.filter(p => p.status === 'Completed');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    { label: "Total Projects", value: projects.length, icon: "🏗️", color: "bg-blue-500" },
    { label: "New Requests", value: projectRequests.length, icon: "📩", color: "bg-amber-500" },
    { label: "Active Jobs", value: activeProjects.length, icon: "⚡", color: "bg-green-500" },
    { label: "Completed", value: completedProjects.length, icon: "✅", color: "bg-purple-500" }
  ];

  return (
    <div className="space-y-8 animate-fade-in p-8 bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Management Central</h1>
          <p className="text-gray-500 mt-1 font-medium">Control center for all Scaffoldz construction operations.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-800">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center text-xl shadow-lg ring-4 ring-opacity-10 ring-black`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* New Requests Card Grid */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
              Pending Approval ({projectRequests.length})
            </h3>
            <Link to="/management/requests" className="text-sm font-bold text-primary hover:underline">View All Requests →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectRequests.length === 0 ? (
              <div className="col-span-2 bg-white p-12 rounded-2xl border-2 border-dashed border-gray-100 text-center text-gray-400 font-medium">
                No pending project requests found.
              </div>
            ) : (
              projectRequests.slice(0, 4).map(request => (
                <div key={request.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-primary/40 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 uppercase tracking-tighter">New Request</span>
                      <span className="text-[10px] text-gray-400 font-bold">{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{request.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{request.location}</p>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            {request.customer_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{request.customer_name || "Unknown User"}</p>
                    </div>
                  </div>
                  <Link 
                    to={`/management/project-request/${request.id}`} 
                    className="mt-6 w-full text-center bg-gray-50 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    Review & Process
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links / Ongoing Info */}
        <div className="space-y-6">
           <div className="px-2">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Ongoing Work
            </h3>
           </div>
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {activeProjects.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 font-medium italic">No ongoing projects.</div>
                ) : (
                    activeProjects.slice(0, 5).map(p => (
                        <Link key={p.id} to={`/project/${p.id}/overview`} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-10 rounded-full ${['Active', 'In Progress'].includes(p.status) ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800 truncate max-w-[150px]">{p.title}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{p.contractor_name || "Unassigned"}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded">VIEW</span>
                        </Link>
                    ))
                )}
                {activeProjects.length > 5 && (
                    <div className="p-4 text-center">
                        <Link to="/management/projects" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors">SEE ALL ACTIVE PROJECTS</Link>
                    </div>
                )}
           </div>

           {/* Quick Actions Card */}
           <div className="bg-primary p-6 rounded-2xl shadow-lg ring-4 ring-primary/5">
                <h4 className="text-white font-bold mb-4 text-sm tracking-widest">QUICK ACTIONS</h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                    <Link to="/management/users" className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all">
                        <span className="block text-lg">👥</span>
                        <span className="text-[10px] font-bold text-white uppercase mt-1 block">Staff</span>
                    </Link>
                    <Link to="/management/analytics" className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all">
                        <span className="block text-lg">📊</span>
                        <span className="text-[10px] font-bold text-white uppercase mt-1 block">Stats</span>
                    </Link>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default ManagementDashboard;
