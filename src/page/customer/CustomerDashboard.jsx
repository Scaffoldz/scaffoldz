import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CustomerDashboard() {
  const [projects, setProjects] = useState([
    { id: 1, title: "Sushma Grande Towers", status: "Active", budget: "₹ 5.2 Cr", progress: 65, contractor: "BuildRight Const." },
    { id: 2, title: "DLF Mall Renovation", status: "Planning", budget: "₹ 1.8 Cr", progress: 10, contractor: "Apex Infra" },
  ]);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 1. Load dynamic projects from Assigned Quotations
    const savedQuotations = JSON.parse(localStorage.getItem("quotations") || "[]");
    const assignedProjects = savedQuotations
      .filter(q => q.status === "Assigned")
      .map(q => ({
        id: q.id,
        title: q.project,
        status: "Active",
        budget: q.finalAmount ? `₹ ${(q.finalAmount / 10000000).toFixed(1)} Cr` : q.amount,
        progress: 0,
        contractor: q.contractor,
        isNew: true
      }));

    if (assignedProjects.length > 0) {
      setProjects(prev => [...assignedProjects, ...prev]);
    }

    // 2. Load Notifications
    const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(savedNotifications.filter(n => !n.read));
  }, []);

  const markAsRead = (id) => {
    const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const updated = savedNotifications.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated.filter(n => !n.read));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in py-8 px-4">

      {/* Notifications Banner */}
      {notifications.length > 0 && (
        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n.id} className="bg-primary text-white p-4 rounded-xl shadow-lg flex justify-between items-center border border-white/10 animate-slide-up">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-bold text-sm tracking-tight">{n.title}</p>
                  <p className="text-xs opacity-90">{n.message}</p>
                </div>
              </div>
              <button
                onClick={() => markAsRead(n.id)}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            Welcome back, Mr. Sharma
          </h1>
          <p className="text-gray-500 mt-2">Here is an overview of your ongoing construction projects.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/customer/submit-project" className="bg-primary text-white px-6 py-3 rounded-md shadow-sm hover:bg-primary/90 transition-colors font-semibold">
            + Start New Project
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("userRole");
              window.location.href = "/";
            }}
            className="bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 px-4 py-3 rounded-md transition-all font-semibold shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 font-sans">Ongoing Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all group relative overflow-hidden">
              {project.isNew && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-tighter">
                  Just Started
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{project.contractor}</p>
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {project.status}
                </span>
              </div>

              <div className="space-y-4 mb-6 pt-4 border-t border-gray-50">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-400 uppercase tracking-widest">Budget Value</span>
                  <span className="text-gray-700">{project.budget}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Overall Progress</span>
                    <span className="text-primary">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              </div>

              <Link to={`/project/${project.id}/overview`} className="block w-full text-center py-3 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm hover:bg-primary hover:text-white hover:shadow-lg transition-all border border-gray-100 overflow-hidden">
                Manage Project Workspace
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
