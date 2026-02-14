function Analytics() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">
          Platform Analytics
        </h1>
        <p className="text-gray-500 mt-1">Detailed performance metrics and reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Total Users</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">1,240</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Active Sessions</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">85</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Avg. Session Time</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">12m 30s</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Bounce Rate</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">24%</h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 h-96 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Traffic Overview</h3>
        <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
          Traffic Graph Placeholder
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">User Demographics</h3>
          <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
            Map/Pie Chart Placeholder
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Device Usage</h3>
          <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
            Bar Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
