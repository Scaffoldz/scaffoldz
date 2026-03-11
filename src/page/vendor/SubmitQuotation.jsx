import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

export default function SubmitQuotation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const requestId = searchParams.get("requestId");

  const [requestDetails, setRequestDetails] = useState(
    location.state?.request || {
      projectName: "Unknown Project",
      materialType: "Unknown Material",
      quantity: 0,
      unit: "Units",
    }
  );

  const [formData, setFormData] = useState({
    pricePerUnit: "",
    estimatedDeliveryTime: "",
    additionalNotes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!requestId) {
      console.warn("No request ID provided.");
    }
  }, [requestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const totalAmount = parseFloat(formData.pricePerUnit) * requestDetails.quantity;
      
      await api.procurement.submitQuotation({
        requestId: requestId,
        pricePerUnit: formData.pricePerUnit,
        totalAmount: totalAmount,
        estimatedDeliveryTime: formData.estimatedDeliveryTime,
        additionalNotes: formData.additionalNotes
      });
      
      alert("Quotation submitted successfully!");
      navigate("/vendor/dashboard");
    } catch (err) {
      alert("Failed to submit quotation: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Submit Quotation</h1>
        <p className="text-gray-500 text-sm mt-1">Provide your pricing and delivery estimate for the requested materials</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Request Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Project Name</p>
            <p className="font-medium text-gray-800">{requestDetails.projectName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Material Requested</p>
            <p className="font-medium text-gray-800">{requestDetails.materialType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quantity Required</p>
            <p className="font-medium text-gray-800">{requestDetails.quantity} {requestDetails.unit}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <div>
          <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 mb-1">
            Price per Unit ($) *
          </label>
          <input
            type="number"
            id="pricePerUnit"
            name="pricePerUnit"
            required
            step="0.01"
            min="0"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
            value={formData.pricePerUnit}
            onChange={handleChange}
            placeholder={`e.g. 5.50 per ${requestDetails.unit}`}
          />
          {formData.pricePerUnit && (
             <p className="text-sm text-gray-500 mt-2">
              Total Estimated Amount: <span className="font-bold">${(parseFloat(formData.pricePerUnit) * requestDetails.quantity).toFixed(2)}</span>
            </p>
          )}
        </div>

        <div>
           <label htmlFor="estimatedDeliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Delivery Time *
          </label>
          <input
            type="text"
            id="estimatedDeliveryTime"
            name="estimatedDeliveryTime"
            required
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
            value={formData.estimatedDeliveryTime}
            onChange={handleChange}
            placeholder="e.g. 2-3 business days after approval"
          />
        </div>

        <div>
           <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (Optional)
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            rows="4"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Any terms, conditions, or brand specifics you want to clarify."
          />
        </div>

        <div className="flex gap-4 p-4 border-t border-gray-100 justify-end">
          <button 
             type="button" 
             onClick={() => navigate(-1)}
             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded transition-colors ${isSubmitting ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quotation'}
          </button>
        </div>
      </form>
    </div>
  );
}
