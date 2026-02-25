import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function MyProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyProjects = async () => {
            try {
                setLoading(true);
                const response = await api.projects.getAll();
                setProjects(response.projects || []);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch my projects:", err);
                setError("Failed to load your projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-primary">My Projects</h1>
                    <p className="text-gray-500 mt-1">View and manage your ongoing construction projects.</p>
                </div>
                <Link to="/customer/submit-project" className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all">
                    + New Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-6xl opacity-20">📂</span>
                    <h3 className="text-xl font-bold text-gray-700">No Projects Yet</h3>
                    <p className="text-gray-500 max-w-md">
                        You haven't submitted any project requests yet. Click the button above to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">{project.title}</h3>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${['Active', 'In Progress'].includes(project.status) ? 'bg-green-100 text-green-700' :
                                    project.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description || "No description provided."}</p>
                            <div className="flex items-center text-xs text-gray-400 gap-4 mb-4">
                                <span className="flex items-center gap-1">📍 {project.location}</span>
                                <span className="flex items-center gap-1">💰 ₹ {Number(project.budget).toLocaleString('en-IN')}</span>
                            </div>

                            {project.status === 'Bidding' && Number(project.bid_count) === 0 && (
                                <div className="bg-orange-50 p-2 rounded border border-orange-100 text-[10px] text-orange-700 font-bold uppercase tracking-wider text-center mb-4">
                                    ⚠️ No contractor available (Waiting...)
                                </div>
                            )}

                            {project.assigned_contractor_id || ['Assigned', 'In Progress', 'Completed'].includes(project.status) ? (
                                <Link
                                    to={`/project/${project.id}/overview`}
                                    className="block w-full text-center py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all text-sm"
                                >
                                    View Dashboard
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="block w-full text-center py-2 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg font-bold text-sm cursor-not-allowed"
                                >
                                    {project.status === 'Bidding' ? 'Waiting for Bids' : 'Under Review'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyProjects;
