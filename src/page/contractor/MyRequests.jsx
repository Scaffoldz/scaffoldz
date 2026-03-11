import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.procurement.getContractorRequests();
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Failed to fetch all procurement requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveQuote = async (requestId, quoteId) => {
    try {
      await api.procurement.approveQuotation(quoteId);
      alert("Quotation approved and supply order created!");
      fetchRequests(); // Refresh list to show updated status
    } catch (err) {
      alert("Failed to approve quotation: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Material Procurement</h1>
          <p className="text-gray-500 mt-1 flex items-center">
            Review and approve quotations for all your active project material requests.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-5xl">
        {requests.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
            <h3 className="text-lg font-bold text-gray-700 mb-2">No material requests found</h3>
            <p className="text-gray-500 text-sm mb-6">You haven't requested any materials yet.</p>
            <p className="text-xs text-gray-400">To create a request, go to a specific project and click 'Material Procurement'.</p>
          </div>
        ) : (
          requests.map(request => (
            <div key={request.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
              {/* Request Header */}
              <div className="bg-gray-50 p-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-800 text-lg">{request.material_type}</h3>
                      <Link to={`/project/${request.project_id}/procurement`} className="text-xs uppercase font-bold text-accent bg-accent/10 px-2 py-0.5 rounded hover:bg-accent/20 transition-colors">
                        {request.project_name}
                      </Link>
                   </div>
                  <p className="text-sm text-gray-500">
                    Requested: <span className="font-semibold text-gray-700">{request.quantity} {request.unit}</span> | Deadline: <span className="font-semibold text-gray-700">{new Date(request.deadline).toLocaleDateString()}</span>
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${request.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {request.status}
                </span>
              </div>
              
              {/* Quotations List */}
              <div className="p-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Vendor Quotations ({request.quotations ? request.quotations.length : 0})</h4>
                
                {!request.quotations || request.quotations.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No vendors have submitted quotes for this request yet.</p>
                ) : (
                  <div className="space-y-3">
                    {request.quotations.map(quote => (
                      <div key={quote.id} className={`p-4 rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${quote.status === 'Approved' ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div>
                          <p className="font-bold text-gray-800">{quote.vendor_name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Price: <span className="font-semibold text-gray-900">₹{Number(quote.price_per_unit).toLocaleString()}</span>/{request.unit} 
                            <span className="mx-2 text-gray-300">|</span> 
                            Delivery: {quote.estimated_delivery_time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total amount: <span className="font-semibold text-gray-900">₹{Number(quote.total_amount).toLocaleString()}</span>
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          {quote.status === "Approved" ? (
                            <span className="text-green-600 font-bold flex items-center gap-1">
                              <span className="text-lg">✓</span> Approved
                            </span>
                          ) : quote.status === "Rejected" ? (
                            <span className="text-gray-400 font-medium text-sm">Rejected</span>
                          ) : request.status === "Open" ? (
                            <button 
                              onClick={() => handleApproveQuote(request.id, quote.id)}
                              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors shadow-sm"
                            >
                              Approve Quote
                            </button>
                          ) : (
                             <span className="text-gray-400 font-medium text-sm">Not Selected</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
