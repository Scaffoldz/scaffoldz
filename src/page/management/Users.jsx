import { useState, useEffect } from "react";
import api from "../../services/api";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await api.users.getAll();
                // Ensure the data is in the expected format (id, name, email, role, status)
                // If backend fields differ, we might need a mapping here.
                setUsers(response.users || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-8 animate-fade-in p-8">
            <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary">User Management</h1>
                    <p className="text-gray-500 mt-1">Control access levels and monitor platform activity.</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                        <tr>
                            <th className="p-4 border-b border-gray-100">User Details</th>
                            <th className="p-4 border-b border-gray-100">Role</th>
                            <th className="p-4 border-b border-gray-100">Status</th>
                            <th className="p-4 border-b border-gray-100">Last Active</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((u, i) => (
                            <tr key={u.id || i} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                                            {(u.fullName || u.name || "U").split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{u.fullName || u.name}</p>
                                            <p className="text-xs text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                        u.role === 'customer' ? 'bg-blue-50 text-blue-600' : 
                                        u.role === 'contractor' ? 'bg-amber-50 text-amber-600' :
                                        u.role === 'management' ? 'bg-purple-50 text-purple-600' :
                                        u.role === 'vendor' ? 'bg-green-50 text-green-600' :
                                        'bg-gray-50 text-gray-600'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded ${u.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        u.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {u.status || 'Active'}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-gray-500 font-medium">
                                    {u.last_login ? new Date(u.last_login).toLocaleDateString() : new Date(u.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-gray-400 italic">No users found in the system.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
