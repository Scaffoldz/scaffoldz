function Users() {
    const users = [
        { name: "Rahul Sharma", role: "Customer", status: "Active" },
        { name: "BuildRight Const.", role: "Contractor", status: "Active" },
        { name: "Apex Infra", role: "Contractor", status: "Suspended" },
    ];

    return (
        <div className="space-y-8 animate-fade-in p-8">
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold text-primary">User Access Log</h1>
                <p className="text-gray-500 mt-1">Monitor registered users and their account status.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-4 border-b border-gray-200">Name</th>
                            <th className="p-4 border-b border-gray-200">Role</th>
                            <th className="p-4 border-b border-gray-200">Status</th>
                            <th className="p-4 border-b border-gray-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((u, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 text-sm font-bold text-gray-800">{u.name}</td>
                                <td className="p-4 text-sm text-gray-600">{u.role}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-gray-400 hover:text-primary font-medium text-xs border border-gray-200 px-3 py-1 rounded">Edit</button>
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
