import { Link } from "react-router-dom";

function ActiveProjects() {
    const projects = [
        { id: 1, title: "Sushma Grande Towers", location: "Zirakpur", completion: 65, color: "bg-blue-500" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">My Active Projects</h1>
                <p className="text-gray-500 mt-1">Work you are currently assigned to.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">{project.title}</h3>
                                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                    <span>📍</span> {project.location}
                                </p>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Active</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs font-semibold text-gray-600">
                                <span>Completion</span>
                                <span>{project.completion}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full ${project.color}`} style={{ width: `${project.completion}%` }}></div>
                            </div>
                        </div>

                        <Link to={`/project/${project.id}/overview`} className="block w-full text-center py-2 bg-primary/10 text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-all">
                            Go to Project Dashboard
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ActiveProjects;
