import { useState, useEffect } from "react";
import SupplyOrderCard from "../../components/vendor/SupplyOrderCard";
import api from "../../services/api";

export default function SupplyOrders() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await api.procurement.getVendorOrders();
        
        // Filter out completed/cancelled orders
        const active = (data.orders || []).filter(
          o => o.delivery_status !== 'Delivered' && o.delivery_status !== 'Cancelled'
        ).map(order => ({
           id: order.id,
           projectName: order.project_name,
           materialType: order.material_type,
           quantity: order.quantity,
           unit: order.unit,
           contractorName: order.contractor_name,
           estimatedDelivery: new Date(order.created_at).toLocaleDateString(), // Placeholder until we add explicit delivery timelines to orders
           deliveryStatus: order.delivery_status
        }));
        
        setActiveOrders(active);
      } catch (err) {
        console.error("Failed to fetch supply orders:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Active Supply Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage your approved material supply orders</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading active orders...</div>
      ) : activeOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          No active supply orders.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map(order => (
            <SupplyOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
