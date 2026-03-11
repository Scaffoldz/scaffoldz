import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function ProjectProcurement() {
  const { id: projectId } = useParams();
  const userRole = localStorage.getItem("userRole"); // "contractor" or "customer" 
  
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    materialType: "",
    quantity: "",
    unit: "",
    deadline: ""
  });
  
  // State for customer suggestions
  const [suggestion, setSuggestion] = useState("");
  const [suggestionsList, setSuggestionsList] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.procurement.getProjectRequests(projectId);
      setRequests(data.requests || []);
    } catch (err) {
      console.error("Failed to fetch procurement requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    
    // Maintain mock customer suggestions for now
    setSuggestionsList([
      { id: 1, author: "Customer", text: "Please ensure the material quality meets the project specifications.", date: new Date().toISOString().split("T")[0] }
    ]);
  }, [projectId]);

  const handleAddRequest = async (e) => {
    e.preventDefault();
    try {
      await api.procurement.createRequest({
        projectId: projectId,
        materialType: newRequest.materialType,
        quantity: newRequest.quantity,
        unit: newRequest.unit,
        deadline: newRequest.deadline
      });
      setIsModalOpen(false);
      setNewRequest({ materialType: "", quantity: "", unit: "", deadline: "" });
      fetchRequests(); // Refresh list
    } catch (err) {
      alert("Failed to create request: " + err.message);
    }
  };

  const handleApproveQuote = async (requestId, quoteId) => {
    try {
      await api.procurement.approveQuotation(quoteId);
      alert("Quotation approved and supply order created!");
      fetchRequests(); // Refresh list to show updated status
    } catch (err) {
      alert("Failed to approve quotation: " + err.message);
    }
  };

  const handleAddSuggestion = (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    
    const newSuggestion = {
      id: Date.now(),
      author: "Customer",
      text: suggestion,
      date: new Date().toISOString().split("T")[0]
    };
    
    setSuggestionsList([newSuggestion, ...suggestionsList]);
    setSuggestion("");
  };

  return (
    <div className="space-y-8 animate-fade-in p-2">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Material Procurement</h1>
          <p className="text-gray-500 text-sm mt-1">
            {userRole === "contractor" 
              ? "Request materials from vendors and review quotations." 
              : "View material requests and provide suggestions."}
          </p>
        </div>
        {userRole === "contractor" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 font-bold transition-all shadow-sm text-sm"
          >
            + New Material Request
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Requests & Quotations */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Material Requests</h2>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-400">
              No material requests for this project yet.
            </div>
          ) : (
            requests.map(request => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {/* Request Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{request.material_type}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Req: {request.quantity} {request.unit} | Deadline: {new Date(request.deadline).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${request.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {request.status}
                </span>
              </div>
              
              {/* Quotations List */}
              <div className="p-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Vendor Quotations ({request.quotations.length})</h4>
                
                {!request.quotations || request.quotations.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No quotations received yet.</p>
                ) : (
                  <div className="space-y-3">
                    {request.quotations.map(quote => (
                      <div key={quote.id} className={`p-4 rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${quote.status === 'Approved' ? 'border-green-300 bg-green-50' : 'border-gray-100 hover:border-gray-300'}`}>
                        <div>
                          <p className="font-bold text-gray-800">{quote.vendor_name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Price: <span className="font-semibold">₹{Number(quote.price_per_unit).toLocaleString()}</span>/{request.unit} 
                            <span className="mx-2 text-gray-300">|</span> 
                            Delivery: {quote.estimated_delivery_time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total: <span className="font-semibold">₹{Number(quote.total_amount).toLocaleString()}</span>
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          {quote.status === "Approved" ? (
                            <span className="text-green-600 font-bold flex items-center gap-1">
                              <span className="text-lg">✓</span> Approved
                            </span>
                          ) : quote.status === "Rejected" ? (
                            <span className="text-gray-400 font-medium text-sm">Rejected</span>
                          ) : request.status === "Open" && userRole === "contractor" ? (
                            <button 
                              onClick={() => handleApproveQuote(request.id, quote.id)}
                              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors shadow-sm"
                            >
                              Approve Quote
                            </button>
                          ) : (
                            <span className="text-yellow-600 font-medium text-sm bg-yellow-50 px-2 py-1 rounded">Pending review</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )))}
        </div>

        {/* Right Column: Customer Suggestions */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Suggestions</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {suggestionsList.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No suggestions yet.</p>
              ) : (
                suggestionsList.map((sug) => (
                  <div key={sug.id} className="bg-blue-50/50 p-3 rounded border border-blue-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-blue-800">{sug.author}</span>
                      <span className="text-[10px] text-gray-400">{sug.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{sug.text}</p>
                  </div>
                ))
              )}
            </div>

            {userRole === "customer" && (
              <form onSubmit={handleAddSuggestion} className="border-t border-gray-100 pt-4">
                <label className="block text-xs font-bold text-gray-600 mb-2">Leave a suggestion</label>
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  rows="3"
                  placeholder="e.g. Please prefer eco-friendly paint."
                  required
                />
                <button 
                  type="submit"
                  className="mt-2 w-full bg-accent text-primary font-bold py-2 rounded hover:bg-accent/90 transition-colors text-sm"
                >
                  Post Suggestion
                </button>
              </form>
            )}
            
            {userRole === "contractor" && (
              <div className="border-t border-gray-100 pt-4 text-xs text-gray-500 italic">
                Only the customer can add suggestions here. Use standard messaging to reply.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Contractor New Request Modal */}
      {isModalOpen && userRole === "contractor" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Create Material Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleAddRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Material Type</label>
                <input
                  required
                  type="text"
                  value={newRequest.materialType}
                  onChange={(e) => setNewRequest({ ...newRequest, materialType: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="e.g., Cement (Grade 43)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Quantity</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Unit</label>
                  <input
                    required
                    type="text"
                    value={newRequest.unit}
                    onChange={(e) => setNewRequest({ ...newRequest, unit: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Bags, Tons, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Needed By (Deadline)</label>
                <input
                  required
                  type="date"
                  value={newRequest.deadline}
                  onChange={(e) => setNewRequest({ ...newRequest, deadline: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200 transition-colors text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-bold rounded hover:bg-primary/90 transition-colors text-sm shadow-sm">Post Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
