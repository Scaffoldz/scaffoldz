import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function TrackProgress() {
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
                console.error("Failed to fetch projects for progress tracking:", err);
                setError("Failed to load projects.");
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

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Track Progress</h1>
                <p className="text-gray-500 mt-1">Real-time updates on your construction milestones.</p>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-6xl opacity-20">📉</span>
                    <h3 className="text-xl font-bold text-gray-700">No Active Projects</h3>
                    <p className="text-gray-500 max-w-md">
                        Once you have active projects, you'll be able to track their progress here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1">📍 {project.location}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${['Active', 'In Progress'].includes(project.status) ? 'bg-green-100 text-green-700' :
                                    'bg-blue-100 text-blue-700'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>

                            {project.status === 'Bidding' && Number(project.bid_count) === 0 && (
                                <div className="bg-orange-50 p-2 rounded border border-orange-100 text-[10px] text-orange-700 font-bold uppercase tracking-wider text-center mt-4">
                                    ⚠️ No contractor available (Waiting...)
                                </div>
                            )}

                            <div className="mt-6 flex gap-3">
                                {project.assigned_contractor_id || ['Assigned', 'In Progress', 'Completed', 'On Hold'].includes(project.status) ? (
                                    <>
                                        <Link
                                            to={`/project/${project.id}/timeline`}
                                            className="flex-1 text-center py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all text-sm shadow-sm"
                                        >
                                            View Timeline
                                        </Link>
                                        <Link
                                            to={`/project/${project.id}/overview`}
                                            className="flex-1 text-center py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-all text-sm"
                                        >
                                            Overview
                                        </Link>
                                    </>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full text-center py-2 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg font-bold text-sm cursor-not-allowed"
                                    >
                                        {project.status === 'Bidding' ? 'Waiting for Bidding to Close' : 'Under Review'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TrackProgress;
