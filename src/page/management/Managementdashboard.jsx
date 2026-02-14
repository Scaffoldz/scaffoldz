import { Link } from "react-router-dom";

function ManagementDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            Management Overview
          </h1>
          <p className="text-gray-500 mt-1">Real-time insights across all projects.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium">
            Export Report
          </button>
          <Link to="/submit-project" className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition-colors font-medium">
            + New Project
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
          <h2 className="text-3xl font-extrabold text-primary mt-2">₹ 45.2Cr</h2>
          <p className="text-xs text-green-500 mt-1 font-semibold">▲ 12% vs last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Projects</p>
          <h2 className="text-3xl font-extrabold text-accent mt-2">12</h2>
          <p className="text-xs text-gray-400 mt-1">2 completing this week</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Invoices</p>
          <h2 className="text-3xl font-extrabold text-orange-500 mt-2">5</h2>
          <p className="text-xs text-gray-400 mt-1">Total: ₹ 1.2Cr</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contractors</p>
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">34</h2>
          <p className="text-xs text-green-500 mt-1 font-semibold">▲ 3 new added</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Graph Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Revenue Trend</h3>
              <select className="border border-gray-300 rounded-md text-sm p-1">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="flex-1 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 bg-gray-50">
              Revenue Graph Placeholder
            </div>
          </div>

          {/* 3D Model Viewer Large */}
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gray-800 rounded-lg h-80 flex flex-col items-center justify-center text-gray-500 gap-4 group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300 opacity-50 text-accent">🏗️</span>
              <span className="font-semibold text-lg tracking-wide text-gray-300 z-10">Live Site View (3D Model)</span>
            </div>
          </div>
        </div>

        {/* Side Panel: Recent activity & Allocation */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Project Status</h3>
            <div className="flex-1 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 bg-gray-50">
              Donut Chart Placeholder
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Quotations</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                  <div>
                    <h4 className="font-bold text-gray-700 text-sm">Concrete Works {i}</h4>
                    <p className="text-xs text-gray-500">Submitted 2h ago</p>
                  </div>
                  <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>
                </div>
              ))}
              <Link to="/management/quotations" className="block text-center text-sm text-accent font-bold mt-4 hover:underline">View All</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagementDashboard;
