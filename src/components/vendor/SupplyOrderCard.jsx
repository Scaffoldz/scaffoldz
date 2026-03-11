export default function SupplyOrderCard({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'In Transit': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Delivered': return 'bg-green-50 text-green-600 border-green-200';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{order.projectName}</h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.deliveryStatus)}`}>
            {order.deliveryStatus}
          </span>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Material Supplied:</span> {order.materialType}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Quantity:</span> {order.quantity} {order.unit}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Contractor:</span> {order.contractorName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Expected Delivery:</span> {order.estimatedDelivery}
          </p>
        </div>
      </div>
    </div>
  );
}
