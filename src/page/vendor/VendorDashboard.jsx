import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function VendorDashboard() {
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [requestsData, ordersData] = await Promise.all([
          api.procurement.getOpenRequests(),
          api.procurement.getVendorOrders()
        ]);
        setRequests(requestsData.requests || []);
        
        // Count active vs completed orders
        const allOrders = ordersData.orders || [];
        setOrders(allOrders);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const activeOrders = orders.filter(o => o.delivery_status !== 'Delivered' && o.delivery_status !== 'Cancelled').length;
  const completedSupplies = orders.filter(o => o.delivery_status === 'Delivered').length;

  // Mock Summary Data
  const summary = {
    activeRequests: requests.length,
    submittedQuotes: '--', // Could calculate by extending API to return vendor's submitted quotes count
    activeOrders: activeOrders,
    completedSupplies: completedSupplies
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Vendor Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your supply activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Requests</p>
            <h3 className="text-3xl font-bold text-gray-800">{summary.activeRequests}</h3>
          </div>
          <Link to="/vendor/quotations" className="text-blue-600 text-sm font-medium hover:underline mt-4 inline-block">View Requests &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Submitted Quotes</p>
            <h3 className="text-3xl font-bold text-gray-800">{summary.submittedQuotes}</h3>
          </div>
          <span className="text-green-600 text-sm font-medium mt-4 inline-block">3 pending approval</span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Orders</p>
            <h3 className="text-3xl font-bold text-gray-800">{summary.activeOrders}</h3>
          </div>
          <Link to="/vendor/orders" className="text-blue-600 text-sm font-medium hover:underline mt-4 inline-block">Track Orders &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
           <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Completed Supplies</p>
            <h3 className="text-3xl font-bold text-gray-800">{summary.completedSupplies}</h3>
          </div>
          <Link to="/vendor/history" className="text-blue-600 text-sm font-medium hover:underline mt-4 inline-block">View History &rarr;</Link>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-lg shadow-sm border border-purple-500 flex flex-col justify-between hover:shadow-md transition-shadow text-white">
          <div>
            <p className="text-sm font-medium text-purple-200 mb-1">AI Bill Generator</p>
            <h3 className="text-lg font-bold">Create professional bills instantly</h3>
          </div>
          <Link to="/vendor/generate-bill" className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold mt-4 inline-block px-3 py-1.5 rounded-lg transition-all">✨ Generate Bill &rarr;</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests Preview panel */}
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Recent Requests</h2>
              <Link to="/vendor/quotations" className="text-sm text-blue-600 hover:underline">See all</Link>
            </div>
            <div className="space-y-4">
              {requests.slice(0, 3).map(req => (
                <div key={req.id} className="border-b border-gray-50 pb-3">
                  <p className="font-medium text-gray-800">{req.project_name} - {req.material_type} ({req.quantity} {req.unit})</p>
                  <p className="text-sm text-gray-500">Deadline: {new Date(req.deadline).toLocaleDateString()}</p>
                </div>
              ))}
              {requests.length === 0 && <p className="text-sm text-gray-400">No recent requests.</p>}
            </div>
         </div>
         {/* Recent Orders Preview panel */}
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Recent Orders</h2>
              <Link to="/vendor/orders" className="text-sm text-blue-600 hover:underline">See all</Link>
            </div>
            <div className="space-y-4">
              {orders.slice(0, 3).map(order => (
                <div key={order.id} className="border-b border-gray-50 pb-3 flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{order.project_name} - {order.material_type} ({order.quantity} {order.unit})</p>
                    <p className="text-sm text-gray-500">Status: {order.delivery_status}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full self-start ${order.delivery_status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                    {order.delivery_status}
                  </span>
                </div>
              ))}
              {orders.length === 0 && <p className="text-sm text-gray-400">No active orders.</p>}
            </div>
         </div>
      </div>
    </div>
  );
}
