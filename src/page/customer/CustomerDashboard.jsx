import { Link } from "react-router-dom";

function CustomerDashboard() {
  const projects = [
    { title: "Sushma Grande Towers", status: "On Track", budget: "₹ 5.2Cr", progress: 65, color: "bg-green-500" },
    { title: "DLF Mall Renovation", status: "Delayed", budget: "₹ 1.8Cr", progress: 40, color: "bg-orange-500" },
    { title: "Tech Park Phase 2", status: "Planning", budget: "₹ 12Cr", progress: 10, color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Overview of your real estate projects.</p>
        </div>
        <Link to="/submit-project" className="bg-primary text-white px-6 py-2.5 rounded-lg shadow hover:bg-primary/90 transition-colors font-medium">
          + New Project
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Projects</p>
          <h2 className="text-3xl font-extrabold text-primary mt-2">{projects.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Budgets</p>
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">₹ 19.0Cr</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completion Rate</p>
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">38%</h2>
        </div>
      </div>

      {/* Project Cards Grid */}
      <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:-translate-y-1 transition-transform border border-gray-100 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-primary/10 transition-colors">
                <span className="text-2xl">🏗️</span>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${project.status === 'On Track' ? 'bg-green-100 text-green-700' : project.status === 'Delayed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {project.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="text-sm text-gray-500 mb-6">Budget: {project.budget}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${project.color}`} style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-400">ID: PRJ-2026-00{index + 1}</span>
              <Link to={`/project/${index + 1}/overview`} className="text-accent font-bold hover:underline">
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerDashboard;
