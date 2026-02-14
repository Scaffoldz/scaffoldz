import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Loader2, Check, X, FileText } from 'lucide-react';

const Quotations = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await api.getQuotations();
            setQuotations(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleAction = (id, action) => {
        // Mock action
        setQuotations(quotations.filter(q => q.id !== id));
        alert(`Quotation ${action}!`);
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Pending Quotations</h1>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Project ID</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Contractor ID</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Amount</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {quotations.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-900">#{q.projectId}</td>
                                <td className="px-6 py-4 text-gray-600">Contractor #{q.contractorId}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">${q.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {q.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleAction(q.id, 'Approved')}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleAction(q.id, 'Rejected')}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                        <X size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {quotations.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No pending quotations.</div>
                )}
            </div>
        </div>
    );
};

export default Quotations;
