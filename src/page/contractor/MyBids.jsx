import { useState, useEffect } from "react";

function MyBids() {
    const [myBids, setMyBids] = useState([]);

    useEffect(() => {
        const allQuotations = JSON.parse(localStorage.getItem("quotations") || "[]");
        const contractorBids = [];

        allQuotations.forEach(q => {
            if (q.bids) {
                const found = q.bids.filter(b => b.contractor === "Current Contractor");
                found.forEach(bid => {
                    contractorBids.push({
                        ...bid,
                        projectTitle: q.project,
                        projectStatus: q.status,
                        bidStatus: q.contractor === "Current Contractor" ? "Selected" : (q.status === "Assigned" ? "Rejected" : "Pending")
                    });
                });
            }
        });

        setMyBids(contractorBids);
    }, []);

    return (
        <div className="space-y-8 animate-fade-in p-8">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">My Proposals</h1>
                <p className="text-gray-500 mt-1">Track the status of your submitted project bids.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {myBids.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>You haven't submitted any bids yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold tracking-wider border-b border-gray-200">
                            <tr>
                                <th className="p-4">Project</th>
                                <th className="p-4">Bid Amount</th>
                                <th className="p-4">Submitted</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {myBids.map((bid) => (
                                <tr key={bid.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-800">{bid.projectTitle}</td>
                                    <td className="p-4 font-mono text-primary font-bold">₹ {bid.amount.toLocaleString()}</td>
                                    <td className="p-4 text-sm text-gray-500">{new Date(bid.submittedAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${bid.bidStatus === "Selected" ? "bg-green-100 text-green-700" :
                                                bid.bidStatus === "Rejected" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                            }`}>
                                            {bid.bidStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default MyBids;
