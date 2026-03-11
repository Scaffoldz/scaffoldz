import { useState, useEffect } from "react";
import api from "../../services/api";
import CountdownTimer from "../../components/CountdownTimer";

function AvailableProjects() {
    const [projects, setProjects] = useState([]);
    const [myBids, setMyBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [bidData, setBidData] = useState({
        amount: "",
        durationMonths: "",
        proposal: ""
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projectsData, bidsData] = await Promise.all([
                api.projects.getTenders(),
                api.bids.getMyBids()
            ]);
            setProjects(projectsData.projects);
            setMyBids(bidsData.bids || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBidClick = (project) => {
        setSelectedProject(project);
        setBidData({
            amount: "",
            durationMonths: "",
            proposal: ""
        });
    };

    const submitBid = async () => {
        if (!bidData.amount || isNaN(bidData.amount)) {
            alert("Please enter a valid bid amount.");
            return;
        }

        const confirm = window.confirm(`Submit bid of ₹ ${Number(bidData.amount).toLocaleString()} for ${selectedProject.title}?`);

        if (confirm) {
            try {
                await api.bids.submit({
                    projectId: selectedProject.id,
                    amount: Number(bidData.amount),
                    durationMonths: Number(bidData.durationMonths),
                    proposal: bidData.proposal
                });
                alert("Bid submitted successfully!");
                setSelectedProject(null);
                fetchData(); // Refresh the list
            } catch (err) {
                alert("Failed to submit bid: " + err.message);
            }
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">Available Projects</h1>
                <p className="text-gray-500 mt-1">Browse and bid on open construction tenders.</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Loading available projects...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">
                    <p>Error: {error}</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No projects currently open for bidding.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => {
                        const hasBid = myBids.some(b => b.project_id === p.id);
                        return (
                            <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-primary/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{p.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">ID: P-{p.id.toString().padStart(4, '0')}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${hasBid ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {hasBid ? 'Bid Submitted' : 'Open'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Closing In:</span>
                                        <span className="text-orange-600">
                                            <CountdownTimer deadline={p.bidding_deadline} />
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                                    <p className="text-sm text-gray-500">📍 {p.location}</p>
                                </div>

                                <div className="space-y-2 mb-6 border-t border-gray-50 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Estimated Budget:</span>
                                        <span className="font-bold text-gray-700">₹ {Number(p.budget).toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleBidClick(p)}
                                    disabled={hasBid}
                                    className={`w-full py-2 rounded-lg font-bold transition-colors shadow-sm ${hasBid
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-primary/90'
                                        }`}
                                >
                                    {hasBid ? 'Bid Already Submitted' : 'Place Bid Now'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Enhanced Bidding Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4 overflow-y-auto">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full my-8">
                        <div className="border-b border-gray-100 pb-4 mb-6 text-primary">
                            <h3 className="text-2xl font-bold">Bid Proposal: {selectedProject.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">Provide detailed information to increase your chances of selection.</p>
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100 italic">
                                "{selectedProject.description}"
                            </div>
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
                                    value={bidData.durationMonths}
                                    onChange={(e) => setBidData({ ...bidData, durationMonths: e.target.value })}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="e.g. 18"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Proposal Description</label>
                                <textarea
                                    value={bidData.proposal}
                                    onChange={(e) => setBidData({ ...bidData, proposal: e.target.value })}
                                    rows="4"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="Detailed proposal including experience and resource plan..."
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
