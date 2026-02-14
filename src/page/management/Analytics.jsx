function Analytics() {
  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Analytics Overview</h1>
        <p className="text-gray-500 mt-1">Performance metrics and financial insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-80 flex flex-col items-center justify-center text-center">
          <div className="text-gray-300 font-bold text-6xl mb-4 opacity-20">📊</div>
          <h3 className="text-lg font-bold text-gray-700">Revenue Trends</h3>
          <p className="text-gray-400 text-sm">Monthly expenditure vs budget allocation.</p>
        </div>

        {/* Project Performance Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-80 flex flex-col items-center justify-center text-center">
          <div className="text-gray-300 font-bold text-6xl mb-4 opacity-20">📈</div>
          <h3 className="text-lg font-bold text-gray-700">Project Velocity</h3>
          <p className="text-gray-400 text-sm">Completion rates across all active sites.</p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
