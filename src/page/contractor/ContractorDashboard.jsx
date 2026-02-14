import { Link } from "react-router-dom";

function ContractorDashboard() {
  // Only assigned active projects
  const assignedProjects = [
    { id: 1, title: "Sushma Grande Towers", location: "Zirakpur", status: "In Progress", deadline: "2024-05-20" },
    { id: 2, title: "DLF Mall Renovation", location: "Gurgaon", status: "Starting Soon", deadline: "2024-06-15" },
  ];

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Designated Works
          </h1>
          <p className="text-gray-500 mt-1">Manage your currently active construction sites.</p>
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
          <p className="text-3xl font-bold text-primary">{assignedProjects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Pending Bids</p>
          <p className="text-3xl font-bold text-orange-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Workers on Site</p>
          <p className="text-3xl font-bold text-green-600">42</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Next Payment</p>
          <p className="text-3xl font-bold text-gray-800">₹ 2.5L</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Sites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedProjects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">📍 {project.location}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${project.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {project.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">Deadline: {project.deadline}</p>
                </div>

                <Link to={`/project/${project.id}/overview`} className="block w-full text-center py-2 bg-primary text-white rounded-md font-bold hover:bg-primary/90 transition-all">
                  Open Project
                </Link>
              </div>
            ))}

            {assignedProjects.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p>No active projects assigned.</p>
                <Link to="/contractor/available-projects" className="text-primary font-bold hover:underline mt-2 inline-block">Find Work</Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Recent Notifications */}
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Recent Notifications</h3>
            <div className="space-y-3">
              <div className="text-xs text-gray-600 pb-2 border-b border-primary/10">
                <p className="font-bold">New Payment Received</p>
                <p className="opacity-70">₹ 50,000 processed for DLF project.</p>
              </div>
              <div className="text-xs text-gray-600">
                <p className="font-bold">Inspection Reminder</p>
                <p className="opacity-70">Site inspection at Sushma Towers tomorrow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractorDashboard;
