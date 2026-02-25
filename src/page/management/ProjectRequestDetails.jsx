import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function ProjectRequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                setLoading(true);
                const data = await api.projects.getById(id);
                setRequest(data.project);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    const handleAccept = async () => {
        const confirm = window.confirm("Accept this project request? It will be moved to Quotations for tendering.");
        if (confirm) {
            try {
                // Set bidding deadline to 24 hours from now
                const deadline = new Date();
                deadline.setHours(deadline.getHours() + 24);

                await api.projects.update(id, {
                    status: 'Bidding',
                    bidding_deadline: deadline.toISOString() // This maps to bidding_deadline in my planned logic/migration script
                });
                alert("Project Accepted. Moved to Quotations.");
                navigate("/management/quotations");
            } catch (err) {
                alert("Failed to accept project: " + err.message);
            }
        }
    };

    const handleReject = async () => {
        const confirm = window.confirm("Reject this project request?");
        if (confirm) {
            try {
                await api.projects.update(id, { status: 'Cancelled' });
                alert("Project Rejected.");
                navigate("/management/dashboard");
            } catch (err) {
                alert("Failed to reject project: " + err.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading request details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto py-8 px-4">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
                ← Back to Dashboard
            </button>

            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Request #{request.id}</h1>
                    <p className="text-gray-500 mt-1">Submitted by <span className="font-semibold text-gray-800">{request.customer || "Unknown User"}</span></p>
                    <p className="text-xs text-gray-400 mt-1">Submitted on: {new Date(request.submittedAt).toLocaleString()}</p>
                </div>
                <div className="space-x-3">
                    <button onClick={handleReject} className="px-5 py-2 border border-red-200 text-red-600 rounded-md font-bold hover:bg-red-50 transition-colors">
                        Reject
                    </button>
                    <button onClick={handleAccept} className="px-5 py-2 bg-primary text-white rounded-md font-bold hover:bg-primary/90 transition-colors shadow-sm">
                        Accept & Process
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Project Title</span>
                        <p className="text-xl font-bold text-gray-800">{request.title}</p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Location</span>
                        <p className="text-lg text-gray-700">📍 {request.location}</p>
                    </div>
                </div>

                <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</span>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 leading-relaxed">
                        {request.description}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Budget</span>
                        <p className="text-xl font-bold text-primary">₹ {Number(request.budget).toLocaleString()}</p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Expected Duration</span>
                        <p className="text-gray-700 font-medium">{request.duration_months || request.durationMonths || '12'} Months</p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Created At</span>
                        <p className="text-gray-700 font-medium">{new Date(request.created_at || request.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProjectRequestDetails;
