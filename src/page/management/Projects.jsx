import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await api.projects.getAll();
                setProjects(response.projects || []);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
                setError("Failed to load projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 text-center">
                <p className="font-bold">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-red-100 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

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
                            <th className="p-4 border-b border-gray-200">Customer</th>
                            <th className="p-4 border-b border-gray-200">Contractor</th>
                            <th className="p-4 border-b border-gray-200">Status</th>
                            <th className="p-4 border-b border-gray-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No projects found.
                                </td>
                            </tr>
                        ) : (
                            projects.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-sm font-semibold text-gray-600">#{p.id}</td>
                                    <td className="p-4 text-sm text-gray-800 font-bold">{p.title}</td>
                                    <td className="p-4 text-sm text-gray-500">{p.customer_name || "N/A"}</td>
                                    <td className="p-4 text-sm text-gray-500">{p.contractor_name || "Not Assigned"}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                ['Active', 'In Progress'].includes(p.status) ? 'bg-green-100 text-green-700' :
                                                p.status === 'Planning' || p.status === 'Bidding' ? 'bg-blue-100 text-blue-700' :
                                                p.status === 'Completed' ? 'bg-purple-100 text-purple-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link 
                                            to={`/project/${p.id}/overview`}
                                            className="text-accent hover:text-primary font-medium text-sm"
                                        >
                                            Manage
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

export default Projects;
