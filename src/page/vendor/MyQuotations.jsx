import { useState, useEffect } from "react";
import api from "../../services/api";

export default function MyQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        setLoading(true);
        const data = await api.procurement.getVendorQuotations();
        setQuotations(data.quotations || []);
      } catch (err) {
        console.error("Failed to fetch submitted quotations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Submitted Quotations</h1>
        <p className="text-gray-500 text-sm mt-1">Track the status of quotes you've submitted to contractors</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
             <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
               <tr>
                 <th className="px-6 py-4 font-semibold">Quote ID</th>
                 <th className="px-6 py-4 font-semibold">Project</th>
                 <th className="px-6 py-4 font-semibold">Material Requested</th>
                 <th className="px-6 py-4 font-semibold">Contractor</th>
                 <th className="px-6 py-4 font-semibold">Your Price</th>
                 <th className="px-6 py-4 font-semibold">Submitted On</th>
                 <th className="px-6 py-4 font-semibold">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {loading ? (
                 <tr>
                   <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading your quotations...</td>
                 </tr>
               ) : quotations.length === 0 ? (
                 <tr>
                   <td colSpan="7" className="px-6 py-8 text-center text-gray-500">You haven't submitted any quotations yet.</td>
                 </tr>
               ) : (
                 quotations.map((quote) => (
                 <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">#{quote.id}</td>
                    <td className="px-6 py-4">{quote.project_name}</td>
                    <td className="px-6 py-4">{quote.quantity} {quote.unit} - {quote.material_type}</td>
                    <td className="px-6 py-4">{quote.contractor_name}</td>
                    <td className="px-6 py-4">
                      ₹{Number(quote.price_per_unit).toLocaleString()} / {quote.unit}
                      <div className="text-xs text-gray-400 mt-0.5">Total: ₹{Number(quote.total_amount).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">{new Date(quote.submitted_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                          quote.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-200' : 
                          quote.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-yellow-50 text-yellow-600 border-yellow-200'
                       }`}>
                         {quote.status}
                       </span>
                    </td>
                 </tr>
               )))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
