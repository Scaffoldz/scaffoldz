import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function LabourManagement() {
    const { id } = useParams();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newWorker, setNewWorker] = useState({ name: '', role: '', dailyWage: '' });

    useEffect(() => {
        fetchWorkers();
    }, [id]);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const data = await api.labour.getByProject(id);
            setWorkers(data.workers || []);
        } catch (err) {
            console.error("Failed to fetch workers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWorker = async (e) => {
        e.preventDefault();
        try {
            await api.labour.add({ 
                projectId: id, 
                name: newWorker.name, 
                role: newWorker.role, 
                dailyWage: newWorker.dailyWage 
            });
            setShowAddModal(false);
            setNewWorker({ name: '', role: '', dailyWage: '' });
            fetchWorkers();
        } catch (err) {
            alert("Failed to add worker: " + err.message);
        }
    };

    const handleDeleteWorker = async (workerId) => {
        if (!window.confirm("Are you sure you want to remove this worker?")) return;
        try {
            await api.labour.delete(workerId);
            fetchWorkers();
        } catch (err) {
            alert("Failed to delete worker: " + err.message);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in py-8 px-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Labour Management</h1>
                    <p className="text-gray-500 mt-1 font-medium">Control and manage your site workforce details.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg ring-4 ring-primary/10"
                >
                    + Add New Worker
                </button>
            </div>

            {/* Stats View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Workforce</p>
                    <p className="text-3xl font-black text-primary">{workers.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Active Status</p>
                    <p className="text-3xl font-black text-green-600">{workers.filter(w => w.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Daily Budget (est)</p>
                    <p className="text-3xl font-black text-gray-800">₹ {workers.reduce((sum, w) => sum + Number(w.daily_wage), 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Worker List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-700 text-[10px] uppercase font-bold tracking-widest border-b border-gray-200">
                        <tr>
                            <th className="p-4">Worker Name</th>
                            <th className="p-4">Trade / Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Daily Wage</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-12 text-center text-gray-400 italic">Loading workforce data...</td></tr>
                        ) : workers.length === 0 ? (
                            <tr><td colSpan="5" className="p-12 text-center text-gray-400 italic font-medium">No workers added yet. Click "+ Add New Worker" to start.</td></tr>
                        ) : workers.map((worker) => (
                            <tr key={worker.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">{worker.name}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">ID: {worker.id.toString().padStart(4, '0')}</div>
                                </td>
                                <td className="p-4 text-sm font-semibold text-gray-600">{worker.role}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                                        worker.status === "Active" ? "bg-green-50 text-green-600 border border-green-100" : 
                                        worker.status === "On Leave" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                        "bg-gray-50 text-gray-500 border border-gray-100"
                                    }`}>
                                        {worker.status || 'Active'}
                                    </span>
                                </td>
                                <td className="p-4 text-center font-bold text-gray-800">₹ {Number(worker.daily_wage).toLocaleString()}</td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleDeleteWorker(worker.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                        title="Delete Worker"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Worker Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-scale-up">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-black text-primary">New Workforce Entry</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
                        </div>
                        <form onSubmit={handleAddWorker} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. Rahul Sharma"
                                    value={newWorker.name}
                                    onChange={e => setNewWorker({...newWorker, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Role / Trade</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. Head Mason"
                                    value={newWorker.role}
                                    onChange={e => setNewWorker({...newWorker, role: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">Daily Wage (INR)</label>
                                <input 
                                    required
                                    type="number" 
                                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. 850"
                                    value={newWorker.dailyWage}
                                    onChange={e => setNewWorker({...newWorker, dailyWage: e.target.value})}
                                />
                            </div>
                            <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-primary/90 transition-all shadow-lg mt-4">
                                Register Worker
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LabourManagement;
