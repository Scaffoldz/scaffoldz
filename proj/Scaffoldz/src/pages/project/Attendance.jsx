import { useState } from 'react';
import { Users, Plus } from 'lucide-react';

const Attendance = () => {
    // Mock data
    const [workers] = useState([
        { id: 1, name: 'John Doe', role: 'Foreman', status: 'Present' },
        { id: 2, name: 'Jane Smith', role: 'Laborer', status: 'Present' },
        { id: 3, name: 'Bob Johnson', role: 'Electrician', status: 'Absent' },
    ]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Daily Attendance</h2>
                <button className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                    <Plus size={16} />
                    Add Worker
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm">Name</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm">Role</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {workers.map((worker) => (
                            <tr key={worker.id}>
                                <td className="px-6 py-3 text-gray-900">{worker.name}</td>
                                <td className="px-6 py-3 text-gray-500">{worker.role}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${worker.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {worker.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;
