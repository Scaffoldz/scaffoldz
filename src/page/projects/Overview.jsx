function Overview() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Project Overview</h1>
        <p className="text-gray-500 mt-1">Key metrics and status summary.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Executive Summary</h3>
        <p className="text-gray-600 leading-relaxed mb-6">
          This project involves the construction of a high-rise residential complex including 4 towers, podium parking, and a community clubhouse.
          Currently, Phase 1 structural work is in progress with 65% completion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Budget</span>
            <span className="text-2xl font-bold text-primary">₹ 5.2 Cr</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</span>
            <span className="text-2xl font-bold text-gray-700">Jan 15, 2024</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Deadline</span>
            <span className="text-2xl font-bold text-gray-700">Dec 20, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
