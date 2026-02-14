function Analytics() {
  const stats = [
    { label: "Total Revenue", amount: "₹ 8.4 Cr", trend: "+12.5%", color: "text-green-600" },
    { label: "Total Expense", amount: "₹ 5.2 Cr", trend: "+8.2%", color: "text-red-600" },
    { label: "Net Profit", amount: "₹ 3.2 Cr", trend: "+18.4%", color: "text-primary" },
    { label: "Active Tenders", amount: "14", trend: "-2", color: "text-orange-600" },
  ];

  const chartData = [
    { month: "Jan", revenue: 45, expense: 30 },
    { month: "Feb", revenue: 52, expense: 35 },
    { month: "Mar", revenue: 48, expense: 40 },
    { month: "Apr", revenue: 61, expense: 42 },
    { month: "May", revenue: 55, expense: 38 },
    { month: "Jun", revenue: 67, expense: 45 },
  ];

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Financial & Operational Analytics</h1>
        <p className="text-gray-500 mt-1">Real-time performance metrics across all construction projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{s.label}</p>
            <div className="flex justify-between items-end">
              <p className={`text-2xl font-bold ${s.color}`}>{s.amount}</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${s.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue vs Expense Chart */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-800">Revenue vs Expenditure (Monthly)</h3>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary rounded-sm"></div> Revenue</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-accent/40 rounded-sm"></div> Expense</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div className="w-full flex justify-center gap-1 items-end h-48">
                  <div
                    className="w-1/2 bg-primary rounded-t-sm hover:bg-primary/90 transition-all cursor-pointer"
                    style={{ height: `${data.revenue}%` }}
                    title={`₹ ${data.revenue}L`}
                  ></div>
                  <div
                    className="w-1/2 bg-accent/40 rounded-t-sm"
                    style={{ height: `${data.expense}%` }}
                    title={`₹ ${data.expense}L`}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Efficiency */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Operational Efficiency by Project</h3>
          <div className="flex-1 space-y-6">
            {[
              { name: "Sushma Grande", progress: 68, status: "On Track" },
              { name: "DLF Mall", progress: 42, status: "Delayed" },
              { name: "Sector 18 Metro", progress: 91, status: "Ahead" },
            ].map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-700">{p.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === "Ahead" ? "bg-blue-50 text-blue-600" :
                      p.status === "On Track" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>{p.status}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${p.status === "Ahead" ? "bg-blue-500" :
                        p.status === "On Track" ? "bg-primary" : "bg-red-400"
                      }`}
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-[10px] text-gray-400 font-bold">{p.progress}% Completed</p>
              </div>
            ))}
          </div>
          <button className="mt-8 text-sm text-primary font-bold hover:underline flex items-center justify-center gap-2 border border-gray-100 py-2 rounded-lg">
            View Full Operational Report →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
