import { useState, useEffect } from "react";

function AvailableProjects() {
    const [projects, setProjects] = useState([]);
    const [bidData, setBidData] = useState({
        amount: "",
        timeline: "",
        experience: "",
        resourcePlan: ""
    });

    const handleBidClick = (project) => {
        setSelectedProject(project);
        setBidData({
            amount: "",
            timeline: "",
            experience: "",
            resourcePlan: ""
        });
    };

    const submitBid = () => {
        if (!bidData.amount || isNaN(bidData.amount)) {
            alert("Please enter a valid bid amount.");
            return;
        }

        const confirm = window.confirm(`Submit bid of ₹ ${Number(bidData.amount).toLocaleString()} for ${selectedProject.project}?`);

        if (confirm) {
            const allQuotations = JSON.parse(localStorage.getItem("quotations") || "[]");
            const updatedQuotations = allQuotations.map(q => {
                if (q.id === selectedProject.id) {
                    const newBid = {
                        id: Date.now(),
                        contractor: "Current Contractor",
                        amount: Number(bidData.amount),
                        timeline: bidData.timeline,
                        experience: bidData.experience,
                        resourcePlan: bidData.resourcePlan,
                        submittedAt: new Date().toISOString()
                    };
                    return { ...q, bids: [...(q.bids || []), newBid] };
                }
                return q;
            });

            localStorage.setItem("quotations", JSON.stringify(updatedQuotations));
            alert("Bid submitted successfully!");
            setSelectedProject(null);

            const openProjects = updatedQuotations.filter(q => q.status === "Pending");
            setProjects(openProjects);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Available Projects</h1>
                <p className="text-gray-500 mt-1">Browse and bid on open construction tenders.</p>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No projects currently open for bidding.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => (
                        <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-primary/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{p.project}</h3>
                                    <p className="text-xs text-gray-500 mt-1">ID: {p.id}</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Open</span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Estimated Budget:</span>
                                    <span className="font-bold text-gray-700">{p.amount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Current Bids:</span>
                                    <span className="font-bold text-gray-700">{p.bids ? p.bids.length : 0}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleBidClick(p)}
                                className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                Place Bid Now
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Enhanced Bidding Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4 overflow-y-auto">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full my-8">
                        <div className="border-b border-gray-100 pb-4 mb-6 text-primary">
                            <h3 className="text-2xl font-bold">Bid Proposal: {selectedProject.project}</h3>
                            <p className="text-sm text-gray-500 mt-1">Provide detailed information to increase your chances of selection.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Bid Amount (₹)</label>
                                <input
                                    type="number"
                                    value={bidData.amount}
                                    onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="e.g. 5000000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Timeline (Months)</label>
                                <input
                                    type="number"
                                    value={bidData.timeline}
                                    onChange={(e) => setBidData({ ...bidData, timeline: e.target.value })}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="e.g. 18"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Relevant Experience</label>
                                <textarea
                                    value={bidData.experience}
                                    onChange={(e) => setBidData({ ...bidData, experience: e.target.value })}
                                    rows="2"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="Briefly describe similar projects completed..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Resource Plan</label>
                                <textarea
                                    value={bidData.resourcePlan}
                                    onChange={(e) => setBidData({ ...bidData, resourcePlan: e.target.value })}
                                    rows="2"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="Labour count, machinery, materials source..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitBid}
                                className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Submit Proposal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AvailableProjects;
