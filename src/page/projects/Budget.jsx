function Budget() {
  const categories = [
    { name: "Civil & Structural", budgeted: 4500000, actual: 3200000, status: "Under Budget" },
    { name: "Finishing & Interiors", budgeted: 2500000, actual: 150000, status: "Awaiting" },
    { name: "Electrical & HVAC", budgeted: 1200000, actual: 850000, status: "On Track" },
    { name: "Labour & Compliance", budgeted: 800000, actual: 950000, status: "Over Budget" },
    { name: "Overheads & Permits", budgeted: 500000, actual: 480000, status: "Critical" },
  ];

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Budget & Cost Analysis</h1>
        <p className="text-gray-500 mt-1">Comprehensive financial monitoring vs estimated project costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-primary">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Budgeted</p>
          <p className="text-2xl font-bold text-gray-800">₹ 95.00 L</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-red-400">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Actual</p>
          <p className="text-2xl font-bold text-gray-800">₹ 56.30 L</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-green-400">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Remaining</p>
          <p className="text-2xl font-bold text-green-600">₹ 38.70 L</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-bold text-gray-800">Categorized Expenditure</h3>
          <button className="text-[10px] font-bold text-primary uppercase border border-primary/20 px-3 py-1 rounded">Download PDF</button>
        </div>
        <div className="p-6">
          <div className="space-y-8">
            {categories.map((c, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{c.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Actual: ₹ {c.actual.toLocaleString()} / Budget: ₹ {c.budgeted.toLocaleString()}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${c.status === 'Under Budget' ? 'bg-green-50 text-green-600' :
                      c.status === 'Over Budget' ? 'bg-red-50 text-red-600' :
                        c.status === 'Critical' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'
                    }`}>{c.status}</span>
                </div>
                <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full opacity-20 absolute inset-0 ${c.actual > c.budgeted ? 'bg-red-500' : 'bg-primary'
                      }`}
                    style={{ width: '100%' }}
                  ></div>
                  <div
                    className={`h-full relative transition-all duration-1000 ${c.actual > c.budgeted ? 'bg-red-500' : 'bg-primary'
                      }`}
                    style={{ width: `${Math.min(100, (c.actual / c.budgeted) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-gray-400 uppercase tracking-tighter">Utilization</span>
                  <span className={c.actual > c.budgeted ? 'text-red-500' : 'text-primary'}>
                    {((c.actual / c.budgeted) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;
