import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProjectRequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);

    useEffect(() => {
        // Find request by ID
        const savedRequests = JSON.parse(localStorage.getItem("projectRequests") || "[]");
        const foundRequest = savedRequests.find(r => r.id === id);
        if (foundRequest) {
            setRequest(foundRequest);
        } else {
            alert("Request not found!");
            navigate("/management/dashboard");
        }
    }, [id, navigate]);

    const handleAccept = () => {
        const confirm = window.confirm("Accept this project request? It will be moved to Quotations for tendering.");
        if (confirm) {
            // 1. Remove from Requests
            const savedRequests = JSON.parse(localStorage.getItem("projectRequests") || "[]");
            const updatedRequests = savedRequests.filter(r => r.id !== id);
            localStorage.setItem("projectRequests", JSON.stringify(updatedRequests));

            // 2. Add to Quotations (Dynamic Data)
            const savedQuotations = JSON.parse(localStorage.getItem("quotations") || "[]");
            const newQuotation = {
                id: `Q-${Date.now()}`, // Generate Quotation ID
                project: request.title,
                contractor: "Pending Assignment",
                amount: `₹ ${request.budget}`,
                status: "Pending",
                originalRequestId: request.id
            };
            localStorage.setItem("quotations", JSON.stringify([newQuotation, ...savedQuotations]));

            alert("Project Accepted. Moved to Quotations.");
            navigate("/management/quotations");
        }
    };

    const handleReject = () => {
        const confirm = window.confirm("Reject this project request?");
        if (confirm) {
            // Remove from Requests
            const savedRequests = JSON.parse(localStorage.getItem("projectRequests") || "[]");
            const updatedRequests = savedRequests.filter(r => r.id !== id);
            localStorage.setItem("projectRequests", JSON.stringify(updatedRequests));

            alert("Project Rejected.");
            navigate("/management/dashboard");
        }
    };

    if (!request) return <div className="p-8">Loading request details...</div>;

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
                        <p className="text-xl font-bold text-primary">₹ {request.budget}</p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Start Date</span>
                        <p className="text-gray-700 font-medium">{request.startDate}</p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Requested Deadline</span>
                        <p className="text-gray-700 font-medium">{request.deadline}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProjectRequestDetails;
