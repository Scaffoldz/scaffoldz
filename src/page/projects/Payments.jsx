function Payments() {
  const milestones = [
    { title: "Project Advance", amount: "₹ 15,00,000", date: "Jan 12, 2024", status: "Paid", method: "Bank Transfer" },
    { title: "Foundation Completion", amount: "₹ 10,00,000", date: "Feb 28, 2024", status: "Paid", method: "RTGS" },
    { title: "Ground Floor Slab", amount: "₹ 12,50,000", date: "Apr 20, 2024", status: "Processing", method: "Pending" },
    { title: "Brickwork Phase 1", amount: "₹ 8,00,000", date: "Jun 15, 2024", status: "Pending", method: "—" },
    { title: "Final Handover", amount: "₹ 10,80,000", date: "Dec 10, 2024", status: "Pending", method: "—" },
  ];

  return (
    <div className="space-y-8 animate-fade-in p-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-primary">Financial Milestones</h1>
        <p className="text-gray-500 mt-1">Track payment schedules, processed transactions, and upcoming dues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-primary p-8 rounded-2xl shadow-lg text-white">
          <p className="text-primary-foreground/60 text-[10px] font-bold uppercase tracking-widest mb-1">Total Paid</p>
          <p className="text-3xl font-bold">₹ 25.00 L</p>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
            <span className="opacity-60">Next: Ground Floor Slab</span>
            <span className="font-bold">₹ 12.50 L</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Upcoming Due</p>
          <p className="text-3xl font-bold text-gray-800">₹ 12,50,000</p>
          <p className="text-xs text-orange-600 font-bold mt-2">Due in 5 Days</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Project Balance</p>
          <p className="text-3xl font-bold text-gray-800">₹ 31,30,000</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Agreement Value: ₹ 56.30 L</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h3 className="font-bold text-gray-800">Payment Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-4">Milestone</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due/Paid Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {milestones.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-800 text-sm">{m.title}</td>
                  <td className="p-4 text-sm text-gray-700 font-mono font-bold">{m.amount}</td>
                  <td className="p-4 text-xs text-gray-500 font-medium">{m.date}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${m.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        m.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>{m.status}</span>
                  </td>
                  <td className="p-4 text-right text-xs text-gray-400 font-medium">{m.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Payments;
