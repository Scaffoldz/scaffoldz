export default function QuotationRequestCard({ request, onQuote }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{request.projectName}</h3>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            {request.status}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Material:</span> {request.materialType}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Quantity Required:</span> {request.quantity} {request.unit}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Deadline:</span> {request.deadline}
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => onQuote(request.id)}
        className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-opacity-90 transition-colors text-sm font-medium"
      >
        Submit Quotation
      </button>
    </div>
  );
}
