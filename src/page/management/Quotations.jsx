function Quotations() {
  const quotations = [
    { id: "Q-2024-001", client: "Apex Builders", project: "Skyline Tower", amount: "₹ 12,00,000", status: "Pending", date: "2024-02-14" },
    { id: "Q-2024-002", client: "Urban Homes", project: "Villa 45", amount: "₹ 5,50,000", status: "Approved", date: "2024-02-12" },
    { id: "Q-2024-003", client: "City Infra", project: "Metro Station B", amount: "₹ 45,00,000", status: "Rejected", date: "2024-02-10" },
    { id: "Q-2024-004", client: "Green Earth", project: "Park Renovation", amount: "₹ 2,00,000", status: "Pending", date: "2024-02-09" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Quotations
          </h1>
          <p className="text-gray-500 mt-1">Manage and review project quotations.</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg shadow hover:bg-primary/90 transition-colors font-medium">
          Create Quotation
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="p-4 border-b border-gray-200">ID</th>
                <th className="p-4 border-b border-gray-200">Client</th>
                <th className="p-4 border-b border-gray-200">Project</th>
                <th className="p-4 border-b border-gray-200">Amount</th>
                <th className="p-4 border-b border-gray-200">Date</th>
                <th className="p-4 border-b border-gray-200">Status</th>
                <th className="p-4 border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotations.map((q, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-600">{q.id}</td>
                  <td className="p-4 text-sm text-gray-800 font-medium">{q.client}</td>
                  <td className="p-4 text-sm text-gray-500">{q.project}</td>
                  <td className="p-4 text-sm font-mono text-gray-700">{q.amount}</td>
                  <td className="p-4 text-sm text-gray-500">{q.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${q.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        q.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                      }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-accent hover:text-primary font-medium text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
          <span>Showing 4 of 12 quotations</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quotations;
