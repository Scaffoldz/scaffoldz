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

    const handleSystemSelect = async () => {
        if (bids.length === 0) {
            alert("No bids to select from.");
            return;
        }

        // Find lowest bid
        const lowestBid = bids.reduce((prev, curr) => Number(prev.amount) < Number(curr.amount) ? prev : curr);

        const confirm = window.confirm(`System Recommendation:\nSelect ${lowestBid.contractor_name || lowestBid.contractor} with bid ₹ ${Number(lowestBid.amount).toLocaleString()}?\n\nThis will assign the project and close bidding.`);

        if (confirm) {
            try {
                // Update bid status to 'Selected'
                // The backend likely updates project and other bids too
                await api.bids.updateStatus(lowestBid.id, 'Selected');

                alert(`Project assigned to ${lowestBid.contractor_name || lowestBid.contractor}!`);
                navigate("/management/quotations");
            } catch (err) {
                alert("Failed to assign project: " + err.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading bid details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto py-8 px-4">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
                ← Back to Quotations
            </button>

            <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Bid Review: {quotation.project}</h1>
                    <p className="text-gray-500 mt-1">Review proposals and select a contractor.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Time Remaining</p>
                    <p className="text-2xl font-mono font-bold text-orange-600">
                        <CountdownTimer deadline={quotation.bidding_deadline} />
                    </p>
                </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-orange-800">Auto-Select Enabled</h3>
                    <p className="text-orange-700 text-sm mt-1">System will automatically select the lowest bid in 24 hours.</p>
                </div>
                <button
                    onClick={handleSystemSelect}
                    className="bg-orange-600 text-white px-6 py-2 rounded-md font-bold shadow-sm hover:bg-orange-700 transition-colors"
                >
                    Run System Select Now
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-4 border-b">Contractor Info</th>
                            <th className="p-4 border-b">Bid Amount</th>
                            <th className="p-4 border-b">Timeline</th>
                            <th className="p-4 border-b">Experience & Plan</th>
                            <th className="p-4 border-b text-right">Deviance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bids.sort((a, b) => Number(a.amount) - Number(b.amount)).map((bid, index) => (
                            <tr key={bid.id} className={`${index === 0 ? 'bg-green-50/50' : ''} hover:bg-gray-50 transition-colors`}>
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">{bid.contractor_name || bid.contractor}</div>
                                    <div className="text-xs text-gray-500 italic mt-0.5">{new Date(bid.submitted_at || bid.submittedAt).toLocaleDateString()}</div>
                                    {index === 0 && <span className="inline-block mt-1 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Lowest Bid</span>}
                                </td>
                                <td className="p-4 text-primary font-mono font-bold text-lg">₹ {Number(bid.amount).toLocaleString()}</td>
                                <td className="p-4">
                                    <span className="font-bold text-gray-700">{bid.duration_months || bid.durationMonths || bid.timeline || "18"}</span>
                                    <span className="text-xs text-gray-500 ml-1">Months</span>
                                </td>
                                <td className="p-4 max-w-xs">
                                    <div className="text-sm font-semibold text-gray-800 line-clamp-3" title={bid.proposal}>
                                        {bid.proposal}
                                    </div>
                                </td>
                                <td className="p-4 text-right text-sm font-medium text-gray-500">
                                    {index === 0 ? '-' : `+ ${((Number(bid.amount) - Number(bids.sort((a, b) => Number(a.amount) - Number(b.amount))[0].amount)) / Number(bids.sort((a, b) => Number(a.amount) - Number(b.amount))[0].amount) * 100).toFixed(1)}%`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default ProjectBids;
