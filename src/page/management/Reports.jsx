function Reports() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">System Reports</h1>
                <p className="text-gray-500 mt-1">Generate and view detailed reports.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["Financial Summary", "Project Completion", "Contractor Performance", "Safety Audit", "Material Usage"].map((report, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-accent hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-3xl opacity-50">📄</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">PDF / CSV</span>
                        </div>
                        <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors">{report}</h3>
                        <p className="text-sm text-gray-500 mt-2">Last generated: 2 days ago</p>
                        <button className="mt-4 w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors">Download</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reports;
