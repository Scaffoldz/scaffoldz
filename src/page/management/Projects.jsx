import { Link } from "react-router-dom";

function Projects() {
    const projects = [
        { id: 1, name: "Sushma Grande Towers", status: "Active", contractor: "BuildRight Const.", progress: 65 },
        { id: 2, name: "DLF Mall Renovation", status: "Planning", contractor: "Apex Infra", progress: 10 },
        { id: 3, name: "City Center Plaza", status: "Completed", contractor: "Urban Structures", progress: 100 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">All Projects</h1>
                    <p className="text-gray-500 mt-1">Manage all ongoing and past construction projects.</p>
                </div>
                <button className="bg-primary text-white px-6 py-2.5 rounded-lg shadow hover:bg-primary/90 transition-colors font-medium">
                    + Add Project
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="p-4 border-b border-gray-200">ID</th>
                            <th className="p-4 border-b border-gray-200">Project Name</th>
                            <th className="p-4 border-b border-gray-200">Contractor</th>
                            <th className="p-4 border-b border-gray-200">Status</th>
                            <th className="p-4 border-b border-gray-200">Progress</th>
                            <th className="p-4 border-b border-gray-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 text-sm font-semibold text-gray-600">#{p.id}</td>
                                <td className="p-4 text-sm text-gray-800 font-bold">{p.name}</td>
                                <td className="p-4 text-sm text-gray-500">{p.contractor}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${p.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            p.status === 'Planning' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-4 w-32">
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${p.progress}%` }}></div>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-accent hover:text-primary font-medium text-sm">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Projects;
