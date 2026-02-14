import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Quotations() {
  const [quotations, setQuotations] = useState([
    { id: "Q-2024-001", project: "Sushma Grande", contractor: "BuildRight Const.", amount: "₹ 12,00,000", status: "Pending" },
    { id: "Q-2024-002", project: "DLF Mall", contractor: "Apex Infra", amount: "₹ 5,50,000", status: "Approved" },
  ]);

  useEffect(() => {
    // Load dynamic quotations from localStorage and merge
    const savedQuotations = JSON.parse(localStorage.getItem("quotations") || "[]");
    if (savedQuotations.length > 0) {
      setQuotations(prev => [...savedQuotations, ...prev]);
    }
  }, []);

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Quotations</h1>
        <p className="text-gray-500 mt-1">Review and approve contractor bids.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4 border-b border-gray-200">Quote ID</th>
              <th className="p-4 border-b border-gray-200">Project</th>
              <th className="p-4 border-b border-gray-200">Contractor</th>
              <th className="p-4 border-b border-gray-200">Amount</th>
              <th className="p-4 border-b border-gray-200">Status</th>
              <th className="p-4 border-b border-gray-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotations.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-sm font-semibold text-gray-500">{q.id}</td>
                <td className="p-4 text-sm text-gray-800">{q.project}</td>
                <td className="p-4 text-sm text-gray-600">
                  {q.status === "Pending" ? (
                    <span className="text-orange-600 italic text-xs font-semibold">Open for Bidding</span>
                  ) : (
                    q.contractor
                  )}
                </td>
                <td className="p-4 text-sm font-bold text-gray-800">{q.amount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${q.status === 'Approved' || q.status === 'Assigned' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {q.status === 'Approved' ? 'Pending Assign' : q.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {q.status === 'Pending' && (
                    <Link to={`/management/bids/${q.id}`} className="text-primary text-xs font-bold hover:underline">
                      View Bids ({q.bids ? q.bids.length : 3})
                    </Link>
                  )}
                  {q.status !== 'Pending' && <span className="text-xs text-gray-400">Archived</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Quotations;
