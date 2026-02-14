import { useState } from "react";
import { useParams } from "react-router-dom";

function LabourManagement() {
    const { id } = useParams();
    const [workers] = useState([
        { id: 1, name: "Rahul Sharma", role: "Mason", status: "Present", shift: "Morning", dailyWage: 800 },
        { id: 2, name: "Amit Patel", role: "Helper", status: "Present", shift: "Morning", dailyWage: 500 },
        { id: 3, name: "Vikram Singh", role: "Carpenter", status: "Absent", shift: "N/A", dailyWage: 900 },
        { id: 4, name: "Suresh Kumar", role: "Electrician", status: "Present", shift: "Evening", dailyWage: 850 },
    ]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Labour Management</h1>
                    <p className="text-gray-500 mt-1">Track attendance and manage your workforce payments.</p>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md">
                    + Add New Worker
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Workforce</p>
                    <p className="text-3xl font-bold text-primary">24</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Present Today</p>
                    <p className="text-3xl font-bold text-green-600">18</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Daily Payout</p>
                    <p className="text-3xl font-bold text-gray-800">₹ 14,200</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Safety Incidents</p>
                    <p className="text-3xl font-bold text-red-500">0</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-sm font-bold text-gray-700">
                    <span>Daily Attendance: {new Date().toLocaleDateString()}</span>
                    <button className="text-primary hover:underline">Download Report</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-700 text-xs uppercase font-bold tracking-wider border-b border-gray-200">
                        <tr>
                            <th className="p-4">Worker Name</th>
                            <th className="p-4">Trade/Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Shift</th>
                            <th className="p-4">Daily Wage</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {workers.map((worker) => (
                            <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-gray-800">{worker.name}</td>
                                <td className="p-4 text-sm text-gray-600">{worker.role}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${worker.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}>
                                        {worker.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">{worker.shift}</td>
                                <td className="p-4 text-sm font-mono text-gray-700">₹ {worker.dailyWage}</td>
                                <td className="p-4 text-right">
                                    <button className="text-primary hover:underline text-xs font-bold">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LabourManagement;
