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
        <Link to="/contractor/my-bids" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium transition-colors">
          View My Bids
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="col-span-3 text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p>No active projects assigned.</p>
            <Link to="/contractor/my-bids" className="text-primary font-bold hover:underline mt-2 inline-block">Find Work</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContractorDashboard;
