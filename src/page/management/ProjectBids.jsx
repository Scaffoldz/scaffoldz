import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import CountdownTimer from "../../components/CountdownTimer";

function ProjectBids() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quotation, setQuotation] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectAndBids = async () => {
            try {
                setLoading(true);
                const [projectData, bidsData] = await Promise.all([
                    api.projects.getById(id),
                    api.bids.getByProject(id)
                ]);
                setQuotation(projectData.project);
                setBids(bidsData.bids || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectAndBids();
    }, [id]);

    const handleManualSelect = async (bid) => {
        const confirm = window.confirm(`Assign Project manually to:\n${bid.contractor_name || bid.contractor} (Bid: ₹ ${Number(bid.amount).toLocaleString()})?\n\nThis will notify other bidders as 'Quotation Lost'.`);

        if (confirm) {
            try {
                await api.bids.updateStatus(bid.id, 'Selected');
                alert(`Project assigned to ${bid.contractor_name || bid.contractor}!`);
                navigate("/management/quotations");
            } catch (err) {
                alert("Failed to assign project: " + err.message);
            }
        }
    };

    const handleAutoSelect = async () => {
        const pendingBids = bids.filter(b => b.status === 'Pending');
        if (pendingBids.length === 0) {
            alert("No pending bids available for auto-selection.");
            return;
        }

        const lowestBid = pendingBids.reduce((min, curr) => 
            Number(curr.amount) < Number(min.amount) ? curr : min
        );

        const confirm = window.confirm(`Auto-Select Recommendation:\nThe lowest bid is from ${lowestBid.contractor_name || lowestBid.contractor} for ₹ ${Number(lowestBid.amount).toLocaleString()}.\n\nDo you want to assign the project to them automatically?`);

        if (confirm) {
            try {
                await api.bids.updateStatus(lowestBid.id, 'Selected');
                alert(`Project automatically assigned to ${lowestBid.contractor_name || lowestBid.contractor}!`);
                navigate("/management/quotations");
            } catch (err) {
                alert("Failed to auto-assign project: " + err.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading bid details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto py-8 px-4">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                ← Back to Quotations
            </button>

            <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Bid Review: {quotation.title || quotation.project}</h1>
                    <p className="text-gray-500 mt-1 font-medium">Review Proposals & Manual Contractor Selection</p>
                    {bids.some(b => b.status === 'Pending') && (
                        <button 
                            onClick={handleAutoSelect} 
                            className="mt-4 bg-green-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-md hover:bg-green-700 transition-all flex items-center gap-2"
                        >
                            <span className="text-lg">⚡</span> Auto-Select Lowest Bid
                        </button>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Time Remaining</p>
                    <p className="text-xl font-mono font-black text-orange-500">
                        <CountdownTimer deadline={quotation.bidding_deadline} />
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100">
                        <tr>
                            <th className="p-5">Contractor Info</th>
                            <th className="p-5">Proposal & Timeline</th>
                            <th className="p-5">Bid Amount</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Selection</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {bids.map((bid, index) => (
                            <tr key={bid.id} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="p-5">
                                    <div className="font-black text-gray-800 text-lg uppercase tracking-tight">{bid.contractor_name || bid.contractor}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">{bid.company_name || "Independent Builder"}</div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                                            {bid.experience_years || '5'}+ Yrs Exp
                                        </span>
                                    </div>
                                </td>
                                <td className="p-5 max-w-xs">
                                     <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black text-gray-800 bg-gray-100 px-2 py-1 rounded tracking-tighter">
                                            {bid.duration_months || "18"} MONTHS
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic">
                                        "{bid.proposal}"
                                    </p>
                                </td>
                                <td className="p-5">
                                    <div className="text-xl font-black text-primary tracking-tighter">₹ {Number(bid.amount).toLocaleString()}</div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Total Quotation</p>
                                </td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${
                                        bid.status === 'Selected' ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
                                        bid.status === 'Quotation Lost' ? 'bg-gray-100 text-gray-400 border border-gray-200' :
                                        bid.status === 'Rejected' ? 'bg-red-50 text-red-500 border border-red-100' :
                                        'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>
                                        {bid.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    {bid.status === 'Pending' ? (
                                        <button 
                                            onClick={() => handleManualSelect(bid)}
                                            className="bg-primary text-white text-[10px] font-black px-4 py-2.5 rounded-xl uppercase tracking-widest hover:bg-black transition-all shadow-md group-hover:scale-105"
                                        >
                                            CHOOSE CONTRACTOR
                                        </button>
                                    ) : bid.status === 'Selected' ? (
                                        <span className="text-[10px] font-black text-green-600 uppercase">PROJECT ASSIGNED</span>
                                    ) : (
                                        <span className="text-[10px] font-black text-gray-300 uppercase">INACTIVE</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hint Card */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary text-lg">ℹ️</div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Manual Selection Policy</p>
                        <p className="text-xs text-gray-500 mt-1">Management can select any contractor based on proposal quality, budget, and timeline. Once selected, todos and timelines will be automatically generated for the chosen contractor.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectBids;
