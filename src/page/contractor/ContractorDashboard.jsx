import { Link } from "react-router-dom";

function ContractorDashboard() {
  const assignedProjects = [
    { title: "Sushma Grande Towers", location: "Zirakpur", status: "In Progress", deadline: "2024-05-20", completion: 65, color: "bg-blue-500" },
    { title: "DLF Mall Renovation", location: "Gurgaon", status: "Starting Soon", deadline: "2024-06-15", completion: 0, color: "bg-gray-300" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            Contractor Workspace
          </h1>
          <p className="text-gray-500 mt-1">Manage your assigned projects and tasks.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/contractor-reports" className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium">
            View Reports
          </Link>
          <Link to="/open-projects" className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition-colors font-medium">
            Find Work
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Sites</p>
          <h2 className="text-3xl font-extrabold text-primary mt-2">2</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Tasks</p>
          <h2 className="text-3xl font-extrabold text-orange-500 mt-2">8</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Team Size</p>
          <h2 className="text-3xl font-extrabold text-accent mt-2">15</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Next Payout</p>
          <h2 className="text-3xl font-extrabold text-green-600 mt-2">18th Feb</h2>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignedProjects.map((project, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <span>📍</span> {project.location}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {project.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-600">
                    <span>Completion</span>
                    <span>{project.completion}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${project.color}`} style={{ width: `${project.completion}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <strong>Deadline:</strong> {project.deadline}
                  </div>
                  <Link to="/project/1/overview" className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all">
                    Open Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tasks */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition-all text-left group">
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">👷‍♂️</span>
            <span className="font-bold text-gray-700">Update Labour</span>
          </button>
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition-all text-left group">
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📷</span>
            <span className="font-bold text-gray-700">Upload Photos</span>
          </button>
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition-all text-left group">
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📝</span>
            <span className="font-bold text-gray-700">Daily Log</span>
          </button>
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition-all text-left group">
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">⚠️</span>
            <span className="font-bold text-gray-700">Report Issue</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default ContractorDashboard;
