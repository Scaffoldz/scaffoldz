import { useState, useEffect } from "react";
import api from "../../services/api";

export default function SupplyHistory() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await api.procurement.getVendorOrders();
        
        // Filter for completed orders
        const history = (data.orders || []).filter(
          o => o.delivery_status === 'Delivered'
        ).map(order => ({
           id: order.id,
           projectName: order.project_name,
           materialType: order.material_type,
           quantity: order.quantity,
           unit: order.unit,
           contractorName: order.contractor_name,
           estimatedDelivery: new Date(order.updated_at).toLocaleDateString(), // Use updated_at as delivery date for now
           deliveryStatus: order.delivery_status
        }));
        
        setCompletedOrders(history);
      } catch (err) {
        console.error("Failed to fetch supply history:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Supply History</h1>
          <p className="text-gray-500 text-sm mt-1">Review your completed and delivered supply orders</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
             <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-100">
               <tr>
                 <th className="px-6 py-4 font-semibold">Order ID</th>
                 <th className="px-6 py-4 font-semibold">Project</th>
                 <th className="px-6 py-4 font-semibold">Material</th>
                 <th className="px-6 py-4 font-semibold">Contractor</th>
                 <th className="px-6 py-4 font-semibold">Delivered On</th>
                 <th className="px-6 py-4 font-semibold">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {loading ? (
                 <tr>
                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading supply history...</td>
                 </tr>
               ) : completedOrders.length === 0 ? (
                 <tr>
                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No completed orders found.</td>
                 </tr>
               ) : (
                 completedOrders.map((order) => (
                 <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">#{order.id}</td>
                    <td className="px-6 py-4">{order.projectName}</td>
                    <td className="px-6 py-4">{order.quantity} {order.unit} - {order.materialType}</td>
                    <td className="px-6 py-4">{order.contractorName}</td>
                    <td className="px-6 py-4">{order.estimatedDelivery}</td>
                    <td className="px-6 py-4">
                       <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full border border-green-200">
                         {order.deliveryStatus}
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
