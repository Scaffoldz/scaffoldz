function Users() {
    const users = [
        { name: "Rahul Sharma", email: "rahul@example.com", role: "Customer", status: "Active", lastLogin: "2 hours ago", initial: "RS" },
        { name: "BuildRight Const.", email: "ops@buildright.in", role: "Contractor", status: "Active", lastLogin: "45 mins ago", initial: "BC" },
        { name: "Apex Infra", email: "admin@apexinfra.com", role: "Contractor", status: "Suspended", lastLogin: "3 days ago", initial: "AI" },
        { name: "John Doe", email: "john.d@client.com", role: "Customer", status: "Active", lastLogin: "10 mins ago", initial: "JD" },
        { name: "Modern Builders", email: "contact@modern.com", role: "Contractor", status: "Pending", lastLogin: "Never", initial: "MB" },
    ];

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
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">
                        Add New User
                    </button>
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
                            <th className="p-4 border-b border-gray-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((u, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                                            {u.initial}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                                            <p className="text-xs text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === 'Customer' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded ${u.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            u.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-gray-500 font-medium">{u.lastLogin}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-gray-400 hover:text-primary font-bold text-xs p-1.5 hover:bg-primary/5 rounded">Manage</button>
                                        <button className="text-gray-400 hover:text-red-600 font-bold text-xs p-1.5 hover:bg-red-50 rounded">Block</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
