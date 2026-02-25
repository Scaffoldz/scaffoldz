import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ActiveProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActiveProjects = async () => {
            try {
                setLoading(true);
                // The API already filters projects by user role and assignment in the backend
                const response = await api.projects.getAll();
                // Filter for "Confirmed" projects (assigned to contractor and not in Bidding stage)
                const activeOnes = (response.projects || []).filter(p =>
                    ['Assigned', 'In Progress', 'Completed', 'On Hold'].includes(p.status)
                );
                setProjects(activeOnes);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch active projects:", err);
                setError("Failed to load active projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchActiveProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">My Active Projects</h1>
                <p className="text-gray-500 mt-1">Work you are currently assigned to.</p>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-6xl opacity-20">🏗️</span>
                    <h3 className="text-xl font-bold text-gray-700">No Active Projects</h3>
                    <p className="text-gray-500 max-w-md">
                        You don't have any active projects assigned to you at the moment.
                    </p>
                </div>
            ) : (
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
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">{project.status}</span>
                            </div>

                            <div className="space-y-2 mb-6 text-sm text-gray-600">
                                <p><strong>Customer:</strong> {project.customer_name || "N/A"}</p>
                                <p><strong>Budget:</strong> ₹ {Number(project.budget).toLocaleString('en-IN')}</p>
                            </div>

                            <Link to={`/project/${project.id}/overview`} className="block w-full text-center py-2 bg-primary/10 text-primary rounded-lg font-bold hover:bg-primary hover:text-white transition-all">
                                Go to Project Dashboard
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActiveProjects;
