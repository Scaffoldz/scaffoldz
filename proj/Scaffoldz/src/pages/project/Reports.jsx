import { FileText, Download } from 'lucide-react';

const Reports = () => {
    // Mock reports
    const reports = [
        { id: 1, name: 'Safety Inspection - Jan', date: '2024-01-15', size: '2.4 MB' },
        { id: 2, name: 'Structural Audit', date: '2024-02-10', size: '5.1 MB' },
        { id: 3, name: 'Cost Estmates v2', date: '2024-02-28', size: '1.2 MB' }
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents & Reports</h2>

            <div className="grid grid-cols-1 gap-4">
                {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{report.name}</h3>
                                <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Download size={20} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
                <p>No other reports available.</p>
            </div>
        </div>
    );
};

export default Reports;
