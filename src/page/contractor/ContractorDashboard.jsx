import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ContractorDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = localStorage.getItem("userName") || "Lead Contractor";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.projects.getAll();
        setProjects(response.projects || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch contractor dashboard:", err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate quick stats
  const activeCount = projects.filter(p => ['Active', 'In Progress'].includes(p.status)).length;

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Designated Works
          </h1>
          <p className="text-gray-500 mt-1">Manage your currently active construction sites, {userName}.</p>
        </div>
        <div className="space-x-4">
          <Link to="/contractor/available-projects" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 font-bold transition-all shadow-md">
            + New Bid
          </Link>
          <Link to="/contractor/my-bids" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium transition-colors">
            View My Bids
          </Link>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Active Projects</p>
          <p className="text-3xl font-bold text-primary">{activeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Assigned</p>
          <p className="text-3xl font-bold text-orange-600">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Workers on Site</p>
          <p className="text-3xl font-bold text-green-600">--</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Next Payment</p>
          <p className="text-3xl font-bold text-gray-800">₹ --</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Sites</h2>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p>No active projects assigned.</p>
              <Link to="/contractor/available-projects" className="text-primary font-bold hover:underline mt-2 inline-block">Find Work</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">📍 {project.location}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${['Active', 'In Progress'].includes(project.status) ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {project.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">Budget: ₹ {Number(project.budget || 0).toLocaleString('en-IN')}</p>
                  </div>

                  <Link to={`/project/${project.id}/overview`} className="block w-full text-center py-2 bg-primary text-white rounded-md font-bold hover:bg-primary/90 transition-all">
                    Open Project
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Recent Notifications placeholder */}
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Recent Notifications</h3>
            <div className="space-y-3">
              <div className="text-xs text-gray-600 pb-2 border-b border-primary/10 text-center py-4 opacity-50">
                <p>No new notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractorDashboard;
