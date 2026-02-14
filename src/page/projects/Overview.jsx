function Overview() {
  return (
    <div className="space-y-8 animate-fade-in">

      {/* Hero Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">On Track</span>
          <h1 className="text-3xl font-bold text-primary mt-4 mb-2">Sushma Grande Towers</h1>
          <p className="text-gray-600 max-w-2xl">Construction of 4 residential towers with podium parking and clubhouse. Phase 1 structural work in progress.</p>

          <div className="grid grid-cols-3 gap-8 mt-8 border-t border-gray-100 pt-6">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Budget</p>
              <p className="text-xl font-bold text-gray-800">₹ 5.2 Cr</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Start Date</p>
              <p className="text-xl font-bold text-gray-800">Jan 15, 2024</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Est. Completion</p>
              <p className="text-xl font-bold text-gray-800">Dec 20, 2025</p>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-gray-50 to-transparent"></div>
      </div>

      {/* Progress Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Overall Progress</h3>
          <span className="font-bold text-primary">65%</span>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: "65%" }}></div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="h-2 w-full bg-green-500 rounded-full mb-2"></div>
            <p className="text-xs font-bold text-gray-500">Foundation</p>
          </div>
          <div className="text-center">
            <div className="h-2 w-full bg-green-500 rounded-full mb-2"></div>
            <p className="text-xs font-bold text-gray-500">Structure</p>
          </div>
          <div className="text-center">
            <div className="h-2 w-full bg-blue-500 rounded-full mb-2"></div>
            <p className="text-xs font-bold text-gray-500">Finishing</p>
          </div>
          <div className="text-center">
            <div className="h-2 w-full bg-gray-200 rounded-full mb-2"></div>
            <p className="text-xs font-bold text-gray-500">Handover</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Overview;
