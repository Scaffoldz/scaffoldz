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
  const activeProjects = projects.filter(p => p.status !== 'Submitted' && p.status !== 'Under Review');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Project Overview</h1>
          <p className="text-gray-500 mt-1">Real-time status of all managed constructions.</p>
        </div>
      </div>

      {/* New Project Requests Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
          <h3 className="font-bold text-primary">New Project Requests</h3>
          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold">{projectRequests.length} New</span>
        </div>
        <div className="p-6">
          {projectRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No new project requests.</p>
          ) : (
            <div className="space-y-3">
              {projectRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100 hover:border-primary/30 transition-all shadow-sm">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{request.title}</h4>
                    <p className="text-sm text-gray-500">Submitted by: <span className="font-medium text-gray-700">{request.customer_name || "User"}</span> • {new Date(request.created_at).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/management/project-request/${request.id}`} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-bold text-sm transition-colors">
                    Review Request
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Ongoing Projects</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b border-gray-200">ID</th>
              <th className="p-4 border-b border-gray-200">Project Name</th>
              <th className="p-4 border-b border-gray-200">Contractor</th>
              <th className="p-4 border-b border-gray-200">Budget</th>
              <th className="p-4 border-b border-gray-200">Status</th>
              <th className="p-4 border-b border-gray-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activeProjects.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No active projects.</td>
              </tr>
            ) : (
              activeProjects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 text-sm font-semibold text-gray-500">#{p.id}</td>
                  <td className="p-4 text-sm font-bold text-gray-800">{p.title}</td>
                  <td className="p-4 text-sm text-gray-600">{p.contractor_name || "Not Assigned"}</td>
                  <td className="p-4 text-sm font-medium text-gray-700">₹ {Number(p.budget).toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${['Active', 'In Progress'].includes(p.status) ? 'bg-green-100 text-green-700' :
                        p.status === 'Planning' || p.status === 'Bidding' ? 'bg-blue-100 text-blue-700' :
                          p.status === 'Completed' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-600'
                      }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/project/${p.id}/overview`} className="text-primary font-bold text-sm hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagementDashboard;
