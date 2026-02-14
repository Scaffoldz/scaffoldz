import { Link } from "react-router-dom";

function CustomerDashboard() {
  const projects = [
    { id: 1, title: "Sushma Grande Towers", status: "Active", budget: "₹ 5.2 Cr", progress: 65 },
    { id: 2, title: "DLF Mall Renovation", status: "Planning", budget: "₹ 1.8 Cr", progress: 10 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in py-8 px-4">

      {/* Welcome Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            Welcome back, Mr. Sharma
          </h1>
          <p className="text-gray-500 mt-2">Here is an overview of your ongoing construction projects.</p>
        </div>
        <Link to="/customer/submit-project" className="bg-primary text-white px-6 py-3 rounded-md shadow-sm hover:bg-primary/90 transition-colors font-semibold">
          + Start New Project
        </Link>
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">{project.title}</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {project.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget Estimate</span>
                  <span className="font-bold text-gray-700">{project.budget}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-600">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              </div>

              <Link to={`/project/${project.id}/overview`} className="block w-full text-center py-2.5 bg-gray-50 text-gray-700 rounded-md font-semibold border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all">
                View Details
              </Link>
            </div>
          ))}


        </div>
      </div>

    </div>
  );
}

export default CustomerDashboard;
