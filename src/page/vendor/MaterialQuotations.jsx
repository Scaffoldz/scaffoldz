import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuotationRequestCard from "../../components/vendor/QuotationRequestCard";
import api from "../../services/api";

export default function MaterialQuotations() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await api.procurement.getOpenRequests();
        setRequests(data.requests || []);
      } catch (err) {
        console.error("Failed to fetch open requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleQuoteClick = (requestId, requestDetails) => {
    navigate(`/vendor/submit-quotation?requestId=${requestId}`, { state: { request: requestDetails } });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
       <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Material Quotation Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Browse open requests from contractors and submit your best price</p>
        </div>
        <div className="flex gap-2">
           {/* Simple filter placeholder */}
           <select className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white text-gray-700">
             <option>All Projects</option>
             <option>Skyline Tower</option>
             <option>Riverfront Mall</option>
           </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading open requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          No open material requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => {
            // Map db columns to existing component prop names
            const displayReq = {
               id: req.id,
               projectName: req.project_name,
               materialType: req.material_type,
               quantity: req.quantity,
               unit: req.unit,
               deadline: new Date(req.deadline).toLocaleDateString(),
               status: req.status
            };
            return <QuotationRequestCard key={req.id} request={displayReq} onQuote={(id) => handleQuoteClick(id, displayReq)} />
          })}
        </div>
      )}
    </div>
  );
}
